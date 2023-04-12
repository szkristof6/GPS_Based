import * as API from "../api.js";
import * as Cookie from "../cookie.js";
import * as Message from "../toast.js";

import socket from "../socket.io/connect.js";

const next = "map.html";
const index = "index.html";
const refresh_rate = 1 * 1000;

window.addEventListener("load", async () => {
  // verify

  const loader = document.querySelector(".container");
  loader.style.display = "none";

  socket.on("connect", () => {
    console.log("Connected..");
    navigator.geolocation.getCurrentPosition(
      getData,
      (error) => Message.openToast(`${error.message}`, `An error, has occured: ${error.code}`, "error"),
      {
        enableHighAccuracy: true,
      }
    );
  });
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
    game_id: Cookie.getGID(),
    team_id: "64309e291629620849cd5ff1",
    location: {
      x: crd.longitude,
      y: crd.latitude,
    },
  };

  const player = await API.fetch(playerData, "addPlayer", "POST");

  if (player.status == "success" || player.status == "inplay") {
    Cookie.setPID(player.player_id)

    setInterval(async () => {
      socket.emit("getStatus", Cookie.getGID(), (status) => {
        time.querySelector(".ssc-line").style.display = "none";
        count.querySelector(".ssc-line").style.display = "none";

        if (parseInt(status.status) > 1) {
          Message.openToast("You will be redirected in a second", "The game has begun", "success");

          setTimeout(() => {
            window.location.replace(next);
          }, Message.redirect_time);
        }

        time.querySelector("p").innerHTML = remainingTime(status.time);
        count.querySelector("p").innerHTML = `${status.count}`;
      });
    }, refresh_rate);
  }
}
