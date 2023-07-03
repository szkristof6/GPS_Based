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
	const team2Button = document.querySelector(".team2");

	const teamID1 = data.teams[0].id;
	const teamID2 = data.teams[1].id;

	team1Button.setAttribute("id", teamID1);
	team2Button.setAttribute("id", teamID2);

	team1Button.addEventListener("click", (e) => joinTeam(teamID1));
	team2Button.addEventListener("click", (e) => joinTeam(teamID2));

	const team1Img = document.createElement("img");
	team1Img.setAttribute("src", `${API.default}/cdn/p/${data.teams[0].image}?access_token=${Cookies.get("access_token")}`);
	team1Img.setAttribute("class", "team_img");

	const team2Img = document.createElement("img");
	team2Img.setAttribute("src", `${API.default}/cdn/p/${data.teams[1].image}?access_token=${Cookies.get("access_token")}`);
	team2Img.setAttribute("class", "team_img");

	team1Button.appendChild(team1Img);
	team2Button.appendChild(team2Img);

	const loader = document.querySelector(".container");
	loader.style.display = "none";
});

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

const logoutButton = document.querySelector("#logout");
logoutButton.addEventListener("click", async () => {
	const logged_out = await API.logOut();
	if (logged_out) {
		Message.openToast("You have been logged out!", "Success", "success");

		setTimeout(() => {
			window.location.replace(index);
		}, Message.redirect_time);
	}
});
