import * as API from "../api.js";
import * as Cookie from "../cookie.js";

const index = "index.html";

document.addEventListener("DOMContentLoaded", async () => {
  if (!Cookie.getCookie("Token")) window.location.replace(index);
  if (!Cookie.getCookie("GameID")) window.location.replace(index);
  if (!Cookie.getCookie("PlayerID")) window.location.replace(index);

  getPlayerData();
  getLocation();
});

if (!mapboxgl.supported()) {
  alert("Your browser does not support Mapbox GL");
}

async function setMap() {
  const game_id = Cookie.getCookie("GameID");

  const game = await API.fetchGET(`getGame?game_id=${game_id}`);

  if (game.status === "success") {
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

  return null;
}

const map = await setMap();

async function getPlayerData() {
  const player_id = Cookie.getCookie("PlayerID");
  const player = await API.fetchGET(`getPlayerData?player_id=${player_id}`);

  const esemeny = document.querySelector(".esemeny");
  const user = document.querySelector(".user");

  esemeny.querySelector(".ssc-line").style.display = "none";
  user.querySelector(".ssc-line").style.display = "none";

  esemeny.querySelector("p").innerHTML = `${player.game.name}`;
  user.querySelector("p").innerHTML = `${player.user.name}`;
}

function paintPlayer(player) {
  const player_image = document.createElement("div");
  player_image.className = "player-icon";
  player_image.style.backgroundImage = `url(${new URL(player.user.image)})`;
  player_image.style.width = `40px`;
  player_image.style.height = `40px`;
  player_image.style.backgroundSize = "100%";
  player_image.style.border = `5px solid ${player.team.color}`;

  new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);

  const loader = document.querySelector(".container");
  loader.style.display = "none";
}

async function onSuccess(pos) {
  const crd = pos.coords;

  const player_id = Cookie.getCookie("PlayerID");

  console.log(
    `Time: ${Date.now()} Latitude: ${crd.latitude}, Longitude: ${crd.longitude}, Accuracy ${crd.accuracy} meters.`
  );

  const update = await API.fetchPOST(
    {
      player_id,
      location: {
        x: crd.longitude,
        y: crd.latitude,
      },
    },
    "updateLocation"
  );

  if (update.status == "success") {
    const db = await API.fetchGET(`listPlayers?player_id=${player_id}`);

    console.log(db);

    if (db.count != 0) {
      for (const player of db.players) {
        document.querySelectorAll(".player-icon").forEach((e) => e.remove());

        paintPlayer(player);
      }
    }
  }
  else {
    
  }
}

function onError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.watchPosition(onSuccess, onError, options);
}
