import * as API from "../api.js";
import * as Cookie from "../cookie.js";

const next = "join.html";
const back = "index.html";
const index = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  if (Cookie.getCookie("Token")) window.location.replace(next);
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const backButton = document.querySelector("#back");

backButton.addEventListener("click", () => window.location.replace(back));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(form);
  const json = {
    firstname: formData.get("first"),
    lastname: formData.get("last"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordre: formData.get("passwordre"),
    date: new Date(formData.get("date")),
    token,
  };

  if (json.password !== json.passwordre) {
    console.log({
      message: "The passwords don't match!",
    });
  } else {
    const user = await API.fetchPOST(json, "registerUser");

    if (user.status === "success") {
      window.location.replace(index);
    } else {
      console.error(game);
    }
  }
});
