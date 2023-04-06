import * as API from "../api.js";
import * as Cookie from "../cookie.js";
import * as Message from "../toast.js";

const next = "join.html";
const back = "index.html";
const index = "index.html";

window.addEventListener("load", () => {
  if (Cookie.getCookie("Token")) window.location.replace(next);
  
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
    token,
  };

  if (json.password !== json.passwordre) {
    console.log({
      message: "The passwords don't match!",
    });
  } else {
    const user = await API.fetchPOST(json, "registerUser");

    if (user.status === "success") {
      Message.openToast("The activation email has been sent to your e-mail address!", "Success", user.status);

    setTimeout(() => {
      window.location.replace(index);
    }, Message.redirect_time);

    } else {
      Message.openToast(user.message, "Error", user.status);
    }
  }
});
