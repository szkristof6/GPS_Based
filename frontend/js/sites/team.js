import * as API from "../api.js";
import * as Message from "../toast.js";
import * as Cookie from "../cookie.js";

const next = "waiting.html";
const admin = "admin/";
const index = "index.html";

window.addEventListener("load", async () => {
	API.fetch("", `page/verify?access_token=${Cookies.get("access_token") || ""}`, "GET").then((response) => {
		if (response.status === "allowed" && response.permission === 10) window.location.replace(admin);
		if (response.status === "disallowed") window.location.replace(index);
	});

	const data = await API.fetch("", `game/team/list?access_token=${Cookies.get("access_token")}&g_id=${Cookies.get("g_id")}`, "GET");

	const team1Button = document.querySelector(".team1");
	team1Button.setAttribute("id", data.teams[0].id);
	const team2Button = document.querySelector(".team2");
	team2Button.setAttribute("id", data.teams[1].id);

	const loader = document.querySelector(".container");
	loader.style.display = "none";
});

const team1Button = document.querySelector(".team1");
const team2Button = document.querySelector(".team2");

team1Button.addEventListener("click", (e) => joinTeam(e.target.id));
team2Button.addEventListener("click", (e) => joinTeam(e.target.id));

async function joinTeam(team) {
	const data = await API.fetch({ id: team }, `game/team/join?access_token=${Cookies.get("access_token")}`, "POST");

	if (data.status === "success") {
		Message.openToast("You will be redirected in a second", "Success", "success");

		Cookie.set("t_id", data.t_id);

		setTimeout(() => {
			window.location.replace(next);
		}, Message.redirect_time);
	}
}
