import * as API from "../api.js";
import * as Cookie from "../cookie.js";
import * as Message from "../toast.js";

import socket from "../socket.io/connect.js";

const index = "index.html";
const back = "waiting.html";
const refresh_rate = 5 * 1000;

const player_id = Cookie.getCookie("PlayerID");
const game_id = Cookie.getCookie("GameID");

window.addEventListener("load", async () => {
  if (!Cookie.getCookie("Token")) window.location.replace(index);
  if (!Cookie.getCookie("GameID")) window.location.replace(index);
  if (!Cookie.getCookie("PlayerID")) window.location.replace(index);

  socket.on("connect", () => {
    console.log("Connected..");

    getPlayerData();

    navigator.geolocation.watchPosition(
      onSuccess,
      (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
      { enableHighAccuracy: true }
    );

    setInterval(async () => {
      socket.emit("getStatus", game_id, (status) => {
        if (parseInt(status.status) === 0) {
          Message.openToast("You will be redirected in a second", "The game has stopped", "error");

          setTimeout(() => {
            window.location.replace(back);
          }, Message.redirect_time);
        }
      });

      getLocationOfPlayers();
    }, refresh_rate);
  });
});

if (!mapboxgl.supported()) {
  Message.openToast("Your browser does not support Mapbox GL", "Error", "error");
}

async function setMap() {
  const response = await API.fetchGET(`getGame?game_id=${game_id}`);

  if (response.status === "success") {
    const { game } = response;

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v12?optimize=true",
      center: [game.location.x, game.location.y],
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
  socket.emit("getPlayerData", player_id, (player) => {
    const esemeny = document.querySelector(".esemeny");
    const user = document.querySelector(".user");

    esemeny.querySelector(".ssc-line").style.display = "none";
    user.querySelector(".ssc-line").style.display = "none";

    esemeny.querySelector("p").innerHTML = `${player.game.name}`;
    user.querySelector("p").innerHTML = `${player.user.name}`;
  });
}

function paintPlayer(player) {
  const player_image = document.createElement("img");
  player_image.className = "player-icon";
  player_image.src = `${new URL(player.user.image)}`;
  player_image.style.width = `40px`;
  player_image.style.height = `40px`;
  player_image.style.border = `5px solid ${player.team.color}`;

  new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);

  const loader = document.querySelector(".container");
  loader.style.display = "none";
}

async function getLocationOfPlayers() {
  socket.emit("listPlayers", player_id, (db) => {
    if (db.status === "success") {
      console.log(db);

      if (db.count != 0) {
        document.querySelectorAll(".player-icon").forEach((e) => e.remove());
        for (const player of db.players) paintPlayer(player);
      }
    } else {
      Message.openToast(db.message, "Error", db.status);
    }
  });
}

async function onSuccess(pos) {
  const crd = pos.coords;

  console.log(
    `Time: ${Date.now()} Latitude: ${crd.latitude}, Longitude: ${crd.longitude}, Accuracy ${crd.accuracy} meters.`
  );

  socket.emit(
    "updateLocation",
    {
      player_id,
      location: {
        x: crd.longitude,
        y: crd.latitude,
      },
    },
    (update) => {
      if (update.status !== "success") Message.openToast(update.message, "Error", update.status);
    }
  );
}
