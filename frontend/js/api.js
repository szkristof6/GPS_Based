import * as Cookie from "./cookie.js";

/*
Megadjuk, hogy milyen címen tudjuk elérni a szerverünket.
*/
//const backend_uri = "http://localhost:1337";
const backend_uri = "https://api.stagenex.hu";

export default backend_uri;

/*
Ez a POST request funkció.

Az alkalmazés ezt a funkciót használja, hogyha a szervernek szeretne valami információt átadni.
Ezt az információt JSON formátumban kezeli, mert a szerver így van konfigurálva. 
*/
export const fetchPOST = async (body, route) => {
  return await fetch(`${backend_uri}/${route}`, {
    method: "POST",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.getJWT()}`,
    },
    body: JSON.stringify(body), // JS objektből készítünk egy JSON stringet.
  }).then((response) => response.json()); // A visszakapott JSON stringet átalakítjuk JS által használható objektumra.
};

/*
Ez a GET request funkció.

Az alkalmazés ezt a funkciót használja, hogyha a szerverről szeretnénk megkapni valamit, anélkül, hogy nekünk kéne valamit megadni neki.
Ezt az információt JSON formátumban kezeli, mert a szerver így van konfigurálva. 
*/
export const fetchGET = async (route) => {
  return await fetch(`${backend_uri}/${route}`, {
    method: "GET",
    headers: {
      Accept: "application.json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookie.getJWT()}`,
    },
  }).then((response) => response.json()); // A visszakapott JSON stringet átalakítjuk JS által használható objektumra.
};
