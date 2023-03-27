import * as API from "../api.js";
import * as Cookie from "../cookie.js";

const next = "waiting.html";
const index = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  if (!Cookie.getCookie("Token")) window.location.replace(index);
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const joinButton = document.querySelector("#JoinRoom");
const logoutButton = document.querySelector("#logout");

console.log("6O13_2qXHJyV_lK");
console.log("teszt123");

form.addEventListener("submit", (event) => event.preventDefault());
logoutButton.addEventListener("click", () => {
  Cookie.eraseCookie("Token");

  window.location.replace(index);
});

joinButton.addEventListener("click", async (event) => {
  const formData = new FormData(form);
  const json = {
    id: formData.get("id"),
    password: formData.get("password"),
    token: formData.get("g-recaptcha-response"),
  };
  const game = await API.fetchPOST(json, "getGameID");

  if (game.status === "success") {
    Cookie.setCookie("GameID", game.id, Cookie.exp_time);

    window.location.replace(next);
  } else {
    console.error(game);
  }
});
