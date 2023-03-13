import * as API from "./api.js";
import * as Cookie from "./cookie.js";

// Kiválasztjuk a formokat, hogy a beírt adatokat ki tudjuk majd venni belőlük
const login_form = document.querySelector("form#login");
const registation_form = document.querySelector("form#registation");

// A formon belül a "submit" eseményt nézzük
login_form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Az oldal ujratöltése ellen

  const formData = new FormData(login_form); // Kivesszük a form-ból az adatokat
  const json = {
    username: formData.get("username"),
  }; // A megadott adatokat egy json objektumba rendezzük

  /*
  A szerverről elküldjük a felhasználónevet, amit megnézzük, hogy létezik-e.
  Hogha létezik, akkor visszakapjuk a felhasználóhoz tartozó tokent, amit elmentünk egy sütibe.
  Majd lekérjük a felhasználó pozicióját
    Ha sikeresen le tudtuk kérni, akkor elküldjük a szervernek 
      a játék azonosítót, 
      egy csapat nevet,
      és a játékos pozicióját
    Ha a szerver sikeresen feldolgozza a kérést, akkor átirányítjuk a térkép oldalra
  */
  const user = await API.fetchPOST(json, "loginUser");

  async function onSuccess(pos) {
    const crd = pos.coords; // A location API választából kiválasztjuk magunknak a koordinátákat.

    const playerData = {
      game: Cookie.getCookie("GameID"),
      team: "blue",
      location: {
        x: crd.longitude,
        y: crd.latitude,
      },
    };
    /*
    Itt fontos már, hogy ez az ót csak akkor elérhető, ha a felhasználó megadja a tokenjét.
    Ezt úgy adjuk meg, hogy az url végén megadjuk a tokent egy query paraméterként.
    */ 
    const player = await API.fetchPOST(playerData, `addPlayer?token=${user.token}`);

    if (player.status == "success" && player.status == "inplay") {
      window.location.replace("map.html");
    }
  }

  function onError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  if (user.status == "success") {
    /*
    A token a szerveren úgy van beállítva, hogy 2 óráig legyen érvényes. Ami nagyjából 0.08-ad része egy óránk.
    */
    Cookie.setCookie("Token", user.token, 0.08);
    
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }; // Pár beállítást definiálunk, ezeket a dokumentációból ajánlják

    /*
    Ez a böngészőbe beépített helyzet lekérdező API. 
    Három dolgot adunk meg neki:
      Mi fusson le, ha sikeres volt a lekérdezés,
      Mi történjen, ha nem volt sikeres a lekérdezés,
      A korábban definiált beállításokat
    */
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }
});

// Ez pontosan ugyan úgy működik, mint a bejelentkezés, csak más url-re megy a kérés.
registation_form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(registation_form);
  const json = {
    username: formData.get("username"),
  };

  const user = await API.fetchPOST(json, "registerUser");

  async function onSuccess(pos) {
    const crd = pos.coords;

    const playerData = {
      game: Cookie.getCookie("GameID"),
      team: "blue",
      location: {
        x: crd.longitude,
        y: crd.latitude,
      },
    };
    const player = await API.fetchPOST(playerData, `addPlayer?token=${user.token}`);
    console.log(player);

    window.location.replace("map.html");
  }

  function onError(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  if (user.status == "success") {
    Cookie.setCookie("Token", user.token, 0.08);

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }
});
