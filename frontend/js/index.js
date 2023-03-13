import * as API from "./api.js"; 
import * as Cookie from "./cookie.js";

// Kiválasztjuk a formot, hogy a beírt adatokat ki tudjuk majd venni belőle
const form = document.querySelector("form");

// A formon belül a "submit" eseményt nézzük
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Az oldal ujratöltése ellen

  const formData = new FormData(form); // Kivesszük a form-ból az adatokat
  const json = {
    id: formData.get("code"),
  }; // A megadott adatokat egy json objektumba rendezzük

  /*
  A szerverre egy POST kérést végzünk, hogy megnézzük, jó e a magadott játék azonosító megfelelő e.
  Hogyha helyes, akkor elmentjök az azonosítót mint egy sütit és átirányítjuk a felhasználót a bejelentkezés oldalra.
  Hogyha nem kiírjuk a hibát
  */
  const game = await API.fetchPOST(json, "getGameID");
  if (game.status == "success") {
    const gameid = game.id;
  
    Cookie.setCookie("GameID", gameid, 1);

    window.location.replace("auth.html");
  } else {
    console.error(game);
  }
});
