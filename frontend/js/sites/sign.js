import * as API from "../api.js";
import * as Message from "../toast.js";

const next = "join.html";
const back = "index.html";
const index = "index.html";

window.addEventListener("load", () => {
  API.fetch("", "page/verify", "GET").then((response) => {
    if (response.status === "allowed") window.location.replace(next);
  });

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
    const user = await API.fetch(json, "register", "POST");

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