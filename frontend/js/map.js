import * as API from "./api.js";
import * as Cookie from "./cookie.js";
import map from "./mapbox.js";

// Megnézzük, hogy támogatott-e a mapbox API
if (!mapboxgl.supported()) {
  alert("Your browser does not support Mapbox GL");
}

// A játékos adatait lekérdezzük és a felső sáv adatait feltöltjük vele.
async function getPlayerData() {
  const token = Cookie.getCookie("Token");
  const player = await API.fetchGET(`getPlayerData?token=${token}`);

  document.querySelector(".user").innerHTML = player.username;
}

/*
Játékosok megjeleítése a térképen

Megadjuk a színeket a csapatoknak
Létrehozunk egy div elemet, amit tudunk manipulálni
  Adunk neki egy class-t
  Megadjuk, hogy milyen kép jelenjen meg a térképen, ezt a szerverről kapjuk meg
  Szélességet és magasságot deffiniálunk
  ...
  A bordernek adunk egy színt. Csapatszínt

Majd létrehozzuk a mapbox API által adott funkcióval a markert, amit a játékos szerverről kapott poziciójára helyezünk el.
*/
function paintPlayer(player) {
  const teamA = "#bf1d1d";
  const teamB = "#3427e8"
  const color = player.team = "red" ? teamA : teamB; // JS inline if (állítás ? igaz : hamis)

  const player_image = document.createElement("div");
  player_image.className = "player-icon";
  player_image.style.backgroundImage = `url(${player.image})`;
  player_image.style.width = `40px`;
  player_image.style.height = `40px`;
  player_image.style.backgroundSize = "100%";
  player_image.style.border = `5px solid ${color}`;

  new mapboxgl.Marker(player_image).setLngLat([player.location.x, player.location.y]).addTo(map);
}
/*
Lekérdezzük a játékos pozicióját, amit az adatbázisban frissítünk,
Majd lekérdezzük a szerverről az összes adott játékban játszó játékos adatait
Amiket megjeleítünk a térképen
*/ 

// Ha sikerült a helyzetmeghatározás
async function onSuccess(pos) {
  const crd = pos.coords;

  // Kiírjuk debug okokból a felhasználó pozicióját
  console.log(
    `Time: ${Date.now()} Latitude: ${crd.latitude}, Longitude: ${crd.longitude}, Accuracy ${crd.accuracy} meters.`
  );

  // Elküldjük a szerverre a felhasználó pozicióját, a tokennel együtt
  const update = await API.fetchPOST(
    {
      location: {
        x: crd.longitude,
        y: crd.latitude,
      },
    },
    `updateLocation?token=${Cookie.getCookie("Token")}`
  );

  // Kiírjuk a szerver válaszát
  console.log(update);

  // Ha a szerver sikeresen végrehajtotta a műveletet, akkor..
  if (update.status == "success") {
    // Lekérdezzük a játékosokat
    const db = await API.fetchPOST({game: Cookie.getCookie("GameID")}, `listPlayers?token=${Cookie.getCookie("Token")}`);

    // Hogyha kapunk vissza játékosokat, akkor..
    if (db.length != 0) {
      for (const player of db) {
        // Kitöröljük az oldalról az összes jelenlegi játékos markerét
        document.querySelectorAll(".player-icon").forEach((e) => e.remove());

        // Megjelenítjük az összes játékost
        paintPlayer(player);
      }
    }
  }
}

// Ha nem sikerült a helyzetmeghatározás
function onError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getLocation() {
  // Definiálunk pár opciót
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // Használjuk a beépített API-t
  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

getPlayerData();
getLocation();
setInterval(getLocation, 5000); // 5000ms = 5s-ként frissítjük a poziciókat.
