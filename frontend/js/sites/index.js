import * as API from "../api.js";
import * as Message from "../toast.js";

const next = "join.html";
const signin = "sign.html";
const index = "index.html";

window.addEventListener("load", () => {
  API.fetch("", "verifyPage", "GET").then((response) => {
    if (response.status === "allowed") window.location.replace(next);
  });

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

  const user = await API.fetch(json, "loginUser", "POST");

  if (user.status === "success") {
    Message.openToast("You will be redirected in a second", "Success", user.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(user.message, "Error", user.status);
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
    const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

    const response = await API.fetch(
      { accessToken: user.authResponse.accessToken, status: user.status, token },
      "facebookLogin",
      "POST"
    );

    if (response.status === "success") {
      Message.openToast("You will be redirected in a second", "Success", response.status);

      setTimeout(() => {
        window.location.replace(next);
      }, Message.redirect_time);
    } else {
      Message.openToast(response.message, "Error", response.status);
    }
  }
});

export async function googleLogin(user) {
  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const response = await API.fetch({ credential: user.credential, token }, "googleLogin", "POST");

  if (response.status === "success") {
    Message.openToast("You will be redirected in a second", "Success", response.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(response.message, "Error", response.status);
  }
}
