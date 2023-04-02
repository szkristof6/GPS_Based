import * as API from "../api.js";
import * as Cookie from "../cookie.js";
import * as Message from "../toast.js";

const next = "map.html";
const index = "index.html";
const refresh_rate = 5 * 1000;

document.addEventListener("DOMContentLoaded", async () => {
  if (!Cookie.getCookie("Token")) window.location.replace(index);
});

window.addEventListener("load", () => {
  const loader = document.querySelector(".container");
  loader.style.display = "none";

  getLocation();
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
    game_id: Cookie.getCookie("GameID"),
    team_id: "6421789c49f8622312473347",
    location: {
      x: crd.longitude,
      y: crd.latitude,
    },
  };

  const player = await API.fetchPOST(playerData, "addPlayer");

  if (player.status == "success" || player.status == "inplay") {
    Cookie.setCookie("PlayerID", player.player_id, Cookie.exp_time);

    const count = document.querySelector("#count");
    const time = document.querySelector("#time");

    count.querySelector(".ssc-line").style.display = "none";
    count.querySelector("p").innerHTML = `${player.count}`;

    time.querySelector(".ssc-line").style.display = "none";
    time.querySelector("p").innerHTML = remainingTime(player.time);

    setInterval(async () => {
      time.querySelector(".ssc-line").style.display = "block";
      time.querySelector("p").innerHTML = "";

      count.querySelector(".ssc-line").style.display = "block";
      count.querySelector("p").innerHTML = "";

      const status = await API.fetchGET(`getStatus?game_id=${Cookie.getCookie("GameID")}`);

      time.querySelector(".ssc-line").style.display = "none";
      count.querySelector(".ssc-line").style.display = "none";

      if (parseInt(status.status) > 0) {
        Message.openToast("You will be redirected in a second", "The game has begun", "success");

        setTimeout(() => {
          window.location.replace(next);
        }, Message.redirect_time);
      }

      time.querySelector("p").innerHTML = remainingTime(status.time);
      count.querySelector("p").innerHTML = `${status.count}`;
    }, refresh_rate);
  }
}

const getLocation = () =>
  navigator.geolocation.getCurrentPosition(
    getData,
    (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
    {
      enableHighAccuracy: true,
    }
  );
