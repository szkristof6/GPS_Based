import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";
const back = "waiting.html";
const refresh_rate = 5 * 1000;

window.addEventListener("load", async () => {
	API.fetch("", `page/verify?access_token=${Cookies.get("access_token") || ""}`, "GET").then((response) => {
		if (response.status === "disallowed") window.location.replace(index);
	});

	getPlayerData();

	const data = await API.fetch("", `game/data?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");

	map.setCenter([data.objects[0].location.x, data.objects[0].location.y]);

	drawMapBorder(data.map.location);
	placeMarkers(data.objects);

	getLocationOfPlayers();

	/*
	navigator.geolocation.watchPosition(onSuccess, (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"), { enableHighAccuracy: true });

	setInterval(async () => {
		const response = await API.fetch("", `game/status?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");
		if (response.status === "success") {
			const { game } = response;
			if (game.status === 1 || game.status === 3) {
				Message.openToast("You will be redirected in a second", "The game has stopped", "error");

				setTimeout(() => {
					window.location.replace(back);
				}, Message.redirect_time);
			}
		}

		getLocationOfPlayers();
	}, refresh_rate);

	*/

	const loader = document.querySelector(".container");
	loader.style.display = "none";
});

if (!mapboxgl.supported()) {
	Message.openToast("Your browser does not support Mapbox GL", "Error", "error");
}

mapboxgl.accessToken = "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/satellite-streets-v11?optimize=true",
	center: [19, 47],
	zoom: 14,
	//minZoom: 15,
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

map.on("click", (e) => {
	console.log(JSON.stringify(e.lngLat.wrap()));
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
		teamFlagImg.src = new URL(`${API.default}/cdn/p/${markerData.team.image}?access_token=${Cookies.get("access_token")}`);

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

async function getPlayerData() {
	const response = await API.fetch("", `player/data?access_token=${Cookies.get("access_token")}&p_id=${Cookies.get("p_id")}`, "GET");

	if (response.status === "success") {
		const { data } = response;
		const esemeny = document.querySelector(".esemeny");
		const user = document.querySelector(".user");

		esemeny.querySelector(".ssc-line").style.display = "none";
		user.querySelector(".ssc-line").style.display = "none";

		esemeny.querySelector("p").innerHTML = `${data.game.name}`;
		user.querySelector("p").innerHTML = `${data.user.name}`;
	}
}

function paintPlayer(player) {
	if (player.outside === true) Message.openToast("Player is outside of game area!", "Error", "error");

	const player_circle = document.createElement("span");
	player_circle.className = "dot";
	player_circle.style.background = player.team.color;

	new mapboxgl.Marker(player_circle).setLngLat([player.location.x, player.location.y]).addTo(map);
}

async function getLocationOfPlayers() {
	const response = await API.fetch("", `game/players?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");

	if (response.status === "success") {
		if (response.count != 0) {
			document.querySelectorAll(".player-icon").forEach((e) => e.remove());
			response.players.forEach((player) => paintPlayer(player));
		}
		const loader = document.querySelector(".container");
		loader.style.display = "none";
	} else {
		Message.openToast(response.message, "Error", response.status);
	}
}

async function onSuccess(pos) {
	const crd = pos.coords;

	console.log(`Time: ${Date.now()} Latitude: ${crd.latitude}, Longitude: ${crd.longitude}, Accuracy ${crd.accuracy} meters.`);

	const json = {
		location: {
			x: crd.longitude,
			y: crd.latitude,
		},
	};

	const update = await API.fetch(json, `game/update/location?access_token=${Cookies.get("access_token")}&p_id=${Cookies.get("p_id")}`, "POST");
	if (update.status !== "success") Message.openToast(update.message, "Error", update.status);
}
