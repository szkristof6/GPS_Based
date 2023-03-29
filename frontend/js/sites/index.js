import * as API from "../api.js";
import * as Cookie from "../cookie.js";

const next = "join.html";
const signin = "sign.html";
const index = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  if (Cookie.getCookie("Token")) window.location.replace(next);
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const signinButton = document.querySelector("#signin");
const facebookButton = document.querySelector("#facebook");

signinButton.addEventListener("click", () => window.location.replace(signin));

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(form);
  const json = {
    email: formData.get("email"),
    password: formData.get("password"),
    token,
  };

  const user = await API.fetchPOST(json, "loginUser");

  if (user.status === "success") {
    Cookie.setCookie("Token", user.token, Cookie.exp_time);

    window.location.replace(next);
  } else {
    console.error(user);
  }
});

facebookButton.addEventListener("click", async (event) => {
  const login = () =>
    new Promise((resolve) =>
      FB.login(function (value) {
        resolve(value);
      })
    );

  const user = await login();

  if (user.status === "connected") {
    const formData = new FormData(form);

    const response = await API.fetchPOST({ ...user, token: formData.get("g-recaptcha-response") }, "facebookLogin");

    if (response.status === "success") {
      Cookie.setCookie("Token", response.token, Cookie.exp_time);

      window.location.replace(next);
    } else {
      console.error(response);
    }
  }
});

export async function googleLogin(user) {
  const formData = new FormData(form);

  const response = await API.fetchPOST({ ...user, token: formData.get("g-recaptcha-response") }, "googleLogin");

  if (response.status === "success") {
    Cookie.setCookie("Token", response.token, Cookie.exp_time);

    window.location.replace(next);
  } else {
    console.error(response);
  }
}
