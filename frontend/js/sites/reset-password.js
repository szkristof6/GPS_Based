import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";

window.addEventListener("load", () => {
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
    token,
  };
  const response = await API.fetch(json, "requestResetPassword", "POST");

  if (response.status === "success") {
    Message.openToast("Please follow the instructions sent to your e-mail address!", "Success", response.status);

    setTimeout(() => {
      window.location.replace(index);
    }, Message.redirect_time);
  } else {
    Message.openToast(response.message, "Error", response.status);
  }
});
