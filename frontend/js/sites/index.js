import * as API from "../api.js";
import * as Message from "../toast.js";

const next = "join.html";
const index = "index.html";

window.addEventListener("load", () => {
  API.fetch("", "page/verify", "GET").then((response) => {
    if (response.status === "allowed") window.location.replace(next);
  });

  const loader = document.querySelector(".container");
  loader.style.display = "none";
});

const wrap1 = document.querySelector(".wrap1");
const wrap2 = document.querySelector(".wrap2");

const loginForm = wrap1.querySelector("form#login");
const signinForm = wrap2.querySelector("form#signin");
const facebookButton = wrap1.querySelector("#facebook");
const showButton = wrap1.querySelector(".see_not_see");

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

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(loginForm);
  const json = {
    email: formData.get("email"),
    password: formData.get("password"),
    token,
  };

  const user = await API.fetch(json, "login/user", "POST");

  if (user.status === "success") {
    Message.openToast("You will be redirected in a second", "Success", user.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(user.message, "Error", user.status);
  }
});

signinForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const formData = new FormData(signinForm);
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
      "login/facebook",
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

  const response = await API.fetch({ credential: user.credential, token }, "login/google", "POST");

  if (response.status === "success") {
    Message.openToast("You will be redirected in a second", "Success", response.status);

    setTimeout(() => {
      window.location.replace(next);
    }, Message.redirect_time);
  } else {
    Message.openToast(response.message, "Error", response.status);
  }
}

const registerButtons = document.querySelectorAll(".register");
registerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (wrap1.classList.contains("displayBlock")) {
      wrap1.classList.remove("displayBlock");
      wrap1.classList.add("displayNone");
      wrap2.classList.remove("displayNone");
      wrap2.classList.add("displayBlock");
    } else {
      wrap2.classList.remove("displayBlock");
      wrap2.classList.add("displayNone");
      wrap1.classList.remove("displayNone");
      wrap1.classList.add("displayBlock");
    }
  });
});
