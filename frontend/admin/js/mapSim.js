import * as API from "../../js/api.js";
import * as Message from "../../js/toast.js";

mapboxgl.accessToken = "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

const map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/mapbox/satellite-streets-v11?optimize=true",
	center: [0, 0],
	zoom: 2,
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

const geojsonReader = new FileReader();
const geojsonInput = document.getElementById("geojson-upload");
const mapArray = new Array();

geojsonInput.addEventListener("change", function () {
	if (geojsonInput.files.length > 0) {
		geojsonReader.readAsText(geojsonInput.files[0]);
	}
});

geojsonReader.onload = function (event) {
	const geojson = JSON.parse(event.target.result);

	map.addSource("polygon", {
		type: "geojson",
		data: geojson,
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

	// Zoom the map to the first feature in the GeoJSON
	if (geojson.features.length > 0) {
		const coordinates = geojson.features[0].geometry.coordinates[0];

		coordinates.forEach((item) => mapArray.push({ x: item[0], y: item[1] }));

		map.setCenter([coordinates[0][0], coordinates[0][1]]);
		map.setZoom(10); // You can adjust the zoom level as needed
	}
};

const jsonReader = new FileReader();
const jsonInput = document.getElementById("json-upload");
let objectArray = new Array();

jsonInput.addEventListener("change", function () {
	if (jsonInput.files.length > 0) {
		jsonReader.readAsText(jsonInput.files[0]);
	}
});

jsonReader.onload = function () {
	const jsonData = jsonReader.result;
	const markers = JSON.parse(jsonData);

	objectArray = markers;

	// Create an array of markers with properties
	const mapMarkers = markers.map((markerData) => {
		const markerEl = document.createElement("div");
		markerEl.classList.add("marker", markerData.type);

		// Get the team flag image file from the input element
		const teamFlagFile = document.getElementById(`imageInput${markerData.team}`).files[0];

		if (teamFlagFile) {
			// Create a new image element for the team flag
			const teamFlagImg = document.createElement("img");
			teamFlagImg.src = URL.createObjectURL(teamFlagFile);
			teamFlagImg.style.height = "32px";
			teamFlagImg.style.objectFit = "cover";
			if (markerData.type === "village") {
				teamFlagImg.style.borderRadius = "50%";
				teamFlagImg.style.width = "32px";
			} else {
				teamFlagImg.style.width = "55px";
			}

			teamFlagImg.style.border = "2px solid";
			teamFlagImg.style.borderColor = teamColors[markerData.team];

			// Add the team flag image to the marker element
			markerEl.appendChild(teamFlagImg);
		} else {
			// If no team flag image is selected, fill the marker with the team's color
			markerEl.style.backgroundColor = teamColors[markerData.team];
		}

		const marker = new mapboxgl.Marker({ element: markerEl });
		marker.setLngLat([markerData.lng, markerData.lat]);
		return {
			marker: marker,
			type: markerData.type,
			team: markerData.team,
		};
	});

	// Add all markers to the map
	mapMarkers.forEach((mapMarker) => {
		mapMarker.marker.addTo(map);
	});

	// Center map on first marker
	if (markers.length > 0) {
		map.setCenter([markers[0].lng, markers[0].lat]);
		map.setZoom(10);
	}
};

/* PIN */

const pinContainer = document.querySelector(".pin-code");

pinContainer.addEventListener(
	"keyup",
	function (event) {
		const { target } = event;

		const maxLength = parseInt(target.attributes["maxlength"].value, 10);
		const myLength = target.value.length;

		if (myLength >= maxLength) {
			let next = target;
			while ((next = next.nextElementSibling)) {
				if (next == null) break;
				if (next.tagName.toLowerCase() == "input") {
					next.focus();
					break;
				}
			}
		}

		if (myLength === 0) {
			let next = target;
			while ((next = next.previousElementSibling)) {
				if (next == null) break;
				if (next.tagName.toLowerCase() == "input") {
					next.focus();
					break;
				}
			}
		}
	},
	false
);

pinContainer.addEventListener(
	"keydown",
	function (event) {
		const { target } = event;
		target.value = "";
	},
	false
);

/*
const adminField = document.querySelector("#admin_field");
adminField.addEventListener("input", (e) => {
  console.log(e.target.value);
})
*/

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
	e.preventDefault();

	const fileInputs = document.querySelectorAll('input[type="file"]');
	const formData = new FormData(form);

	for (let i = 0; i < 3; i++) {
		const files = fileInputs[i].files;
		for (let j = 0; j < files.length; j++) {
			formData.append(`images-${i + 1}`, files[j]);
		}
	}

	const imageUpload = await API.fetchForm(formData, `upload/picture?access_token=${Cookies.get("access_token")}&width=64&height=64`);

	const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

	const json = {
		name: formData.get("name"),
		password: formData.get("password"),
		date: formData.get("date"),
		map: mapArray,
		objects: objectArray.map((object) => ({
			type: object.type,
			team: object.team,
			location: { x: object.lng, y: object.lat },
		})),
		images: imageUpload.files,
		token,
	};

	const response = await API.fetch(json, `game/create?access_token=${Cookies.get("access_token")}`, "POST");

	if (response.status === "success") Message.openToast("Game successfully created!", "Success", response.status);
	else Message.openToast(response.message, "Error", response.status);
});
