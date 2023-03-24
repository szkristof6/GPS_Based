import * as API from "../api.js";
import * as Cookie from "../cookie.js";

const next = "waiting.html";
const index = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  if (!Cookie.getCookie("Token")) window.location.replace(index);
});

const form = document.querySelector("form");
const joinButton = document.querySelector("#JoinRoom");
const logoutButton = document.querySelector("#logout");

console.log("641c893a331c80a8e077f747");
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

  if(game.status === "success"){
    Cookie.setCookie("GameID", game.id, Cookie.exp_time);

    console.log("tovább");
    //window.location.replace(next);
  } else {
    console.error(game);
  }
});
