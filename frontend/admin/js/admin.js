import * as API from "../../js/api.js";
import * as Message from "../../js/toast.js";
import * as Cookie from "../../js/cookie.js";

const refresh_rate = 5 * 1000;

const gamesTable = document.querySelector("table");
const contentDiv = document.querySelector(".content");

mapboxgl.accessToken = "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/satellite-streets-v11?optimize=true",
	center: [0, 0],
	zoom: 10,
	performanceMetricsCollection: false,
});

map.addControl(new mapboxgl.NavigationControl());

map.addControl(
	new mapboxgl.GeolocateControl({
		positionOptions: {
			enableHighAccuracy: true,
		},
		trackUserLocation: true,
		showUserHeading: true,
	})
);

const teamColors = {
	0: "red",
	1: "green",
	2: "yellow",
};

function drawTable(games) {
	games.forEach((game) => {
		const rowElement = document.createElement("tr");

		const nameElement = document.createElement("th");
		const nameElementText = document.createTextNode(game.name);
		nameElement.appendChild(nameElementText);
		rowElement.appendChild(nameElement);

		const buttomElement = document.createElement("th");
		const buttomElementButton = document.createElement("button");
		buttomElementButton.setAttribute("id", game.id);
		buttomElementButton.addEventListener("click", (e) => joinGame(e.target.id));
		const buttomElementButtonText = document.createTextNode("Watch");
		buttomElementButton.appendChild(buttomElementButtonText);
		buttomElement.appendChild(buttomElementButton);
		rowElement.appendChild(buttomElement);

		gamesTable.appendChild(rowElement);
	});
}

window.addEventListener("load", async () => {
	const data = await API.fetch("", `game/list?access_token=${Cookies.get("access_token")}`, "GET");

	drawTable(data.games);

	const loader = document.querySelector(".loader_container");
	loader.style.display = "none";
});

function drawMapBorder(location) {
	map.addSource("polygon", {
		type: "geojson",
		data: {
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [location.map((x) => [x.x, x.y])],
			},
		},
	});
	map.addLayer({
		id: "polygon-layer",
		type: "line",
		source: "polygon",
		paint: {
			"line-color": "red",
			"line-width": 2,
		},
	});
}

function placeMarkers(objects) {
	const mapMarkers = objects.map((markerData) => {
		const markerEl = document.createElement("div");
		markerEl.classList.add("marker", markerData.type);

		// Create a new image element for the team flag
		const teamFlagImg = document.createElement("img");
		teamFlagImg.src = new URL(`${API.static_uri}/p/${markerData.team.image}?access_token=${Cookies.get("access_token")}`);

		teamFlagImg.style.height = "32px";
		teamFlagImg.style.objectFit = "cover";
		if (markerData.type === "village") {
			teamFlagImg.style.borderRadius = "50%";
			teamFlagImg.style.width = "32px";
		} else {
			teamFlagImg.style.width = "55px";
		}

		teamFlagImg.style.border = "2px solid";
		teamFlagImg.style.borderColor = teamColors[markerData.id];

		// Add the team flag image to the marker element
		markerEl.appendChild(teamFlagImg);

		const marker = new mapboxgl.Marker({ element: markerEl });
		marker.setLngLat([markerData.location.x, markerData.location.y]);
		return {
			marker,
			type: markerData.type,
			team: markerData.team,
		};
	});

	// Add all markers to the map
	mapMarkers.forEach((mapMarker) => {
		mapMarker.marker.addTo(map);
	});
}

function displayStatus(status) {
	const states = {
		0: ["hourglass.png"],
		1: ["start.png"],
		2: ["pause.png", "end.png"],
		3: ["play.png", "end.png"],
	};

	if (status === 4) {
		console.log("vege");
		return;
	}

	const icons = document.querySelector(".icons");
	icons.innerHTML = "";

	const statusImages = states[Number(status)];

	statusImages.forEach((image, index) => {
		const buttonDiv = document.createElement("button");
		buttonDiv.setAttribute("class", `circle-button button${index + 1}`);

		buttonDiv.addEventListener("click", (e) => changeStatus(image.split(".")[0]));

		const imgTag = document.createElement("img");
		imgTag.setAttribute("src", `../media/icons/${image}`);

		buttonDiv.appendChild(imgTag);
		icons.appendChild(buttonDiv);
	});
}

async function changeStatus(image) {
	const states = {
		hourglass: "waiting",
		start: "start",
		pause: "pause",
		play: "resume",
		end: "stop",
	};

	const data = await API.fetch("", `game/status/${states[image]}?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");

	displayStatus(data.newStatus);
}

async function joinGame(game_id) {
	Message.openToast("Joining to game..", "Success", "success");

	const data = await API.fetch("", `game/data/admin/${game_id}?access_token=${Cookies.get("access_token")}`, "GET");

	Cookie.set("g_id", data.game.id);

	if (data.status === "success") {
		gamesTable.style.display = "none";

		map.setCenter([data.objects[0].location.x, data.objects[0].location.y]);
		map.setZoom(10); // You can adjust the zoom level as needed

		drawMapBorder(data.map.location);
		placeMarkers(data.objects);

		displayStatus(data.game.status);

		setInterval(async () => getLocationOfPlayers(), refresh_rate);

		contentDiv.style.display = "block";
	} else Message.openToast(data.message, "Error", data.status);
}

function paintPlayer(player) {
	const player_image = document.createElement("img");
	player_image.className = "player-icon";
	player_image.src = `${new URL(player.user.image)}`;
	player_image.style.width = `40px`;
	player_image.style.height = `40px`;
	player_image.style.borderRadius = "50%";

	new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);
}

async function getLocationOfPlayers() {
	const response = await API.fetch("", `game/players?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");

	if (response.status === "success") {
		if (response.count != 0) {
			document.querySelectorAll(".player-icon").forEach((e) => e.remove());
			response.players.forEach((player) => paintPlayer(player));
		}
	} else {
		Message.openToast(response.message, "Error", response.status);
	}
}
