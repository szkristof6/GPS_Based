import * as API from "../api.js";
import * as Message from "../toast.js";

const next = "map.html";
const moderator = "moderator.html";
const index = "index.html";
const refresh_rate = 5 * 1000;

window.addEventListener("load", async () => {
  API.fetch("", "page/verify", "GET").then((response) => {
    if (response.status === "disallowed") window.location.replace(index);
  });

  const loader = document.querySelector(".container");
  loader.style.display = "none";

  navigator.geolocation.getCurrentPosition(
    getData,
    (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
    {
      enableHighAccuracy: true,
    }
  );
});

function remainingTime(date) {
  const now = new Date().getTime();
  const futureDate = new Date(date).getTime();

  const timeleft = futureDate - now;

  const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  return `${days} : ${hours} : ${minutes} : ${seconds}`;
}

async function getData(pos) {
  const crd = pos.coords;

  const playerData = {
    location: {
      x: crd.longitude,
      y: crd.latitude,
    },
  };

  const player = await API.fetch(playerData, "player/add", "POST");

  if (player.status === "moderator") {
    Message.openToast("In a second you will be redirected..", "You are a moderator", "success");

    setTimeout(() => {
      window.location.replace(moderator);
    }, Message.redirect_time);
  }

  if (player.status === "success" || player.status === "inplay") {
    setInterval(async () => {
      const response = await API.fetch("", "game/status", "GET");

      if (response.status === "success") {
        time.querySelector(".ssc-line").style.display = "none";
        count.querySelector(".ssc-line").style.display = "none";

        const { game } = response;

        if (parseInt(game.status) > 1) {
          Message.openToast("You will be redirected in a second", "The game has begun", "success");

          setTimeout(() => {
            window.location.replace(next);
          }, Message.redirect_time);
        }

        time.querySelector("p").innerHTML = remainingTime(game.time);
        count.querySelector("p").innerHTML = `${game.count}`;
      }
    }, refresh_rate);
  }
}
