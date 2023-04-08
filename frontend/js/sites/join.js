import * as API from "../api.js";
import * as Cookie from "../cookie.js";
import * as Message from "../toast.js";

const next = "waiting.html";
const index = "index.html";

window.addEventListener("load", () => {
  if (!Cookie.getJWT()) window.location.replace(index);

  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const joinButton = document.querySelector("#JoinRoom");
const logoutButton = document.querySelector("#logout");

console.log("3a1b5d76d7c5728");
console.log("teszt123");

form.addEventListener("submit", (event) => event.preventDefault());
logoutButton.addEventListener("click", () => {
  Cookie.clearJWT();

  window.location.replace(index);
});

joinButton.addEventListener("click", async (event) => {
  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(form);
  const json = {
    id: formData.get("id"),
    password: formData.get("password"),
    token,
  };
  const game = await API.fetchPOST(json, "joinGame");

  if (game.status === "success") {
    Cookie.setGID(game.id);

    Message.openToast("You will be redirected in a second", "Success", game.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(game.message, "Error", game.status);
  }
});
