import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";
const back = "waiting.html";
const refresh_rate = 5 * 1000;

window.addEventListener("load", async () => {
  API.fetch("", "page/verify", "GET").then((response) => {
    if (response.status === "disallowed") window.location.replace(index);
  });

  getPlayerData();

  const data = await API.fetch("", "game/data", "GET");

  map.setCenter([data.objects[0].location.x, data.objects[0].location.y]);
  map.setZoom(10); // You can adjust the zoom level as needed

  drawMapBorder(data);
  placeMarkers(data);

  navigator.geolocation.watchPosition(
    onSuccess,
    (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
    { enableHighAccuracy: true }
  );

  setInterval(async () => {
    const response = await API.fetch("", "game/status", "GET");
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
  center: [0, 0],
  zoom: 8,
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

map.on("click", (e) => {
  console.log(JSON.stringify(e.lngLat.wrap()));
});

function drawMapBorder(data) {
  map.addSource("polygon", {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [data.map.map((x) => [x.x, x.y])],
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

function placeMarkers(data) {
  const mapMarkers = data.objects.map((markerData) => {
    const markerEl = document.createElement("div");
    markerEl.classList.add("marker", markerData.type);

    // Create a new image element for the team flag
    const teamFlagImg = document.createElement("img");
    teamFlagImg.src = new URL(`${API.default}/cdn/p/${markerData.team.image}?width=32&height=32`);
    teamFlagImg.style.width = "32px";
    teamFlagImg.style.height = "32px";
    teamFlagImg.style.objectFit = "cover";
    if (markerData.type === "village") {
      teamFlagImg.style.borderRadius = "50%";
    }

    // Add the team flag image to the marker element
    markerEl.appendChild(teamFlagImg);

    const marker = new mapboxgl.Marker({
      element: markerEl,
      style: {
        height: "20",
        width: "20",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid ",
      },
    });
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
  const response = await API.fetch("", "player/data", "GET");

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
  const player_image = document.createElement("img");
  player_image.className = "player-icon";
  player_image.src = `${new URL(player.user.image)}`;
  player_image.style.width = `40px`;
  player_image.style.height = `40px`;
  player_image.style.borderRadius = "50%";

  new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);
}

async function getLocationOfPlayers() {
  const response = await API.fetch("", "game/players", "GET");

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

  console.log(
    `Time: ${Date.now()} Latitude: ${crd.latitude}, Longitude: ${crd.longitude}, Accuracy ${crd.accuracy} meters.`
  );

  const json = {
    location: {
      x: crd.longitude,
      y: crd.latitude,
    },
  };

  const update = await API.fetch(json, "game/update/location", "POST");
  if (update.status !== "success") Message.openToast(update.message, "Error", update.status);
}
