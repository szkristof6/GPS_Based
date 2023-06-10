import * as API from "../api.js";
import * as Message from "../toast.js";

const next = "team.html";
const admin = "admin/";
const index = "index.html";

window.addEventListener("load", () => {
  API.fetch("", "page/verify", "GET").then((response) => {
    if (response.status === "allowed" && response.permission === 10 ) window.location.replace(admin);
    if (response.status === "disallowed") window.location.replace(index);
  });

  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const joinButton = document.querySelector("#JoinRoom");
const logoutButton = document.querySelector("#logout");

console.log("ccc6adba559bf65f");
console.log("teszt123");

form.addEventListener("submit", (event) => event.preventDefault());
logoutButton.addEventListener("click", async () => {
  const response  = await API.fetch("", "user/logout", "GET");
  if(response.status === "success") {
    Message.openToast("You have been logged out!", "Success", response.status);

    setTimeout(() => {
      window.location.replace(index);
    }, Message.redirect_time);
  }
});

joinButton.addEventListener("click", async (event) => {
  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(form);
  const json = {
    id: formData.get("id"),
    password: formData.get("password"),
    token,
  };
  const game = await API.fetch(json, "game/join", "POST");

  if (game.status === "success") {
    Message.openToast("You will be redirected in a second", "Success", game.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(game.message, "Error", game.status);
  }
});

//pasword visibilty
const showButton = document.querySelector(".see_not_see");

showButton.addEventListener("click", (e) => {
  const input = e.target.parentNode.querySelector("input");

  if (e.target.classList.contains("not_see")) {
    input.type = "text";

    e.target.src = "media/hide.png";
    e.target.classList.remove("not_see");
    e.target.classList.add("see");
  } else if (e.target.classList.contains("see")) {
    input.type = "password";

    e.target.src = "media/eye.png";
    e.target.classList.remove("see");
    e.target.classList.add("not_see");
  }
});