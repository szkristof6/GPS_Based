import * as API from "../api.js";
import * as Message from "../toast.js";

const index = "index.html";

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

window.addEventListener("load", async () => {
  if (!params.token || !params.user_id) window.location.replace(index);

  const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

  const json = {
    user_token: params.token,
    user_id: params.user_id,
    token,
  };
  const response = await API.fetch(json, "user/verify", "POST");

  if (response.status === "success") {
    const loader = document.querySelector(".container");
    loader.style.display = "none";

    Message.openToast("This account has been successfully activated! You can log in now!", "Success", response.status);

    setTimeout(() => {
      window.location.replace(index);
    }, Message.redirect_time);
  } else {
    Message.openToast(response.message, "Error", response.status);
  }
});
