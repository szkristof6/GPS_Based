import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

window.addEventListener("load", () => {
  if (!params.token) window.location.replace(index);
  if (!params.user_id) window.location.replace(index);

  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const form = document.querySelector("form");
const sendButton = document.querySelector("#send");
const backButton = document.querySelector("#back");

form.addEventListener("submit", (event) => event.preventDefault());
backButton.addEventListener("click", () => window.location.replace(index));

sendButton.addEventListener("click", async (event) => {
  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(form);

  const json = {
    email: formData.get("email"),
    password: formData.get("password"),
    passwordre: formData.get("passwordre"),
    user_token: params.token,
    user_id: params.user_id,
    token,
  };
  const response = await API.fetchPOST(json, "resetPassword");

  if (response.status === "success") {
    Message.openToast("The new password has been set! Please log in!", "Success", response.status);

    setTimeout(() => {
      window.location.replace(index);
    }, Message.redirect_time);
  } else {
    Message.openToast(response.message, "Error", response.status);
  }
});
