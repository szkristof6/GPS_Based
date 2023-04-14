import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";
const back = "waiting.html";
const refresh_rate = 5 * 1000;

window.addEventListener("load", async () => {
  API.fetch("", "verifyPage", "GET").then((response) => {
    if (response.status === "disallowed") window.location.replace(index);
  });

  getPlayerData();

  navigator.geolocation.watchPosition(
    onSuccess,
    (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
    { enableHighAccuracy: true }
  );

  setInterval(async () => {
    const response = API.fetch("", "getStatus", "GET");
    if (response.status === "success") {
      const { game } = response;
      if (game.status === 1) {
        Message.openToast("You will be redirected in a second", "The game has stopped", "error");

        setTimeout(() => {
          window.location.replace(back);
        }, Message.redirect_time);
      }
    }

    getLocationOfPlayers();
  }, refresh_rate);
});

if (!mapboxgl.supported()) {
  Message.openToast("Your browser does not support Mapbox GL", "Error", "error");
}

async function setMap() {
  const response = await API.fetch("", "getGame", "GET");

  if (response.status === "success") {
    const { game } = response;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12?optimize=true",
      center: [game.location.y, game.location.x],
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

    return map;
  }
  Message.openToast(response.message, "Error", response.status);
  return null;
}

const map = await setMap();

async function getPlayerData() {
  const response = await API.fetch("", "getPlayerData", "GET");

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
  player_image.style.border = `5px solid ${player.team.color}`;

  new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);
}

async function getLocationOfPlayers() {
  const response = await API.fetch("", "listPlayers", "GET");

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

  const update = await API.fetch(json, "updateLocation", "POST");
  if (update.status !== "success") Message.openToast(update.message, "Error", update.status);
}
