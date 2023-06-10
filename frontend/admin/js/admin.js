import * as API from "../../js/api.js";

const gamesTable = document.querySelector("table");
const contentDiv = document.querySelector(".content");

mapboxgl.accessToken = "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";
const map = new mapboxgl.Map({
  container: "map", // container ID
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [0, 0], // starting position [lng, lat]
  zoom: 5, // starting zoom
});

function drawTable(data) {
  data.game.forEach((game) => {
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
  const data = await API.fetch("", "game/list/admin", "GET");

  drawTable(data);
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

function displayStatus(status) {
  const states = {
    0: ["hourglass.png"],
    1: ["start.png"],
    2: ["pause.png", "end.png"],
    3: ["play.png", "end.png"],
  };

  if(status === 4) {
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

async function changeStatus(image){
  const states = {
    hourglass: "waiting",
    start: "start",
    pause: "pause",
    play: "resume",
    end: "stop",
  };

  const data = await API.fetch("", `game/status/${states[image]}`, "GET");

  displayStatus(data.newStatus)
}

async function joinGame(game_id) {
  const data = await API.fetch("", `game/data/admin/${game_id}`, "GET");

  gamesTable.style.display = "none";

  map.setCenter([data.objects[0].location.x, data.objects[0].location.y]);
  map.setZoom(10); // You can adjust the zoom level as needed

  drawMapBorder(data);
  placeMarkers(data);

  displayStatus(data.game.status);

  contentDiv.style.display = "block";
}
