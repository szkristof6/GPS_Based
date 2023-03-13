import * as API from "./api.js";
import * as Cookie from "./cookie.js";


// Elkészítjük a térképet
async function setMap() {
  // Lekérdezzük a Token és játék azonosítót a sütikből
  const token = Cookie.getCookie("Token");
  const gameid = Cookie.getCookie("GameID");

  // A szerverről lekérdezzük a játék adatait.
  const game = await API.fetchPOST({ id: gameid }, `getGame?token=${token}`); 

  // Megadjuk a MapBox által generált publikus azonosítót
  mapboxgl.accessToken =
    "pk.eyJ1Ijoic3prcmlzdG9mNiIsImEiOiJjbGY0MW4xc20weTViM3FzOWppZWx4ank0In0.OJNQ_-pHbE3BWnyGQSAeUQ";

  /* (A MapBox dokumentációból véve)
  Létrekozzuk a map objektumot.
    1, Megadjuk, hogy a html dokumentumunkban, melyik div-be szereténk betenni a térképet
    2, Kiválasztjuk a megfelelő stílust és térkép verziót
    3, A szerverről megkapott adatokból kiválasztjuk a játék kordinátáit.
    4, Minimum zoom érkék.
    5, Megmondjuk, hogy nem szereténk mindenféle diagnosztikai adatot visszaküldeni a mapbox szervereire
  */
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/outdoors-v12?optimize=true",
    center: [game.location.x, game.location.y],
    zoom: 8,
    //minZoom: 15,
    performanceMetricsCollection: false,
  });

  // Hozzáadjuk a térképhez a navigációs gombokat
  map.addControl(new mapboxgl.NavigationControl());

  /*
  Hozzáadjuk a térképhez a saját pozitió megkeresése gombot.
  Minden opció a dokumentációból lett kinézve
  */  
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    })
  );

  // Debug célokra, kattintásra kiírja a kurzor koordinátáját
  map.on("click", (e) => {
    console.log(JSON.stringify(e.lngLat.wrap()));
  });

  return map;
}

const map = await setMap();

export default map;
