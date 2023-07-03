import * as API from "../api.js";
import * as Message from "../toast.js";
import * as Cookie from "../cookie.js";

const next = "team.html";
const admin = "admin/";
const index = "index.html";

window.addEventListener("load", async () => {
	API.fetch("", `page/verify?access_token=${Cookies.get("access_token") || ""}`, "GET").then((response) => {
		if (response.status === "allowed" && response.permission === 10) window.location.replace(admin);
		if (response.status === "disallowed") window.location.replace(index);
	});

	const response = await API.fetch("", `game/list?access_token=${Cookies.get("access_token")}`, "GET");
	console.log(response);

	const loader = document.querySelector(".container");
	loader.style.display = "none";
});

const form = document.querySelector("form");
const joinButton = document.querySelector("#JoinRoom");
const logoutButton = document.querySelector("#logout");

console.log("787cf2e7940b4db7");
console.log("1234");

form.addEventListener("submit", (event) => event.preventDefault());
logoutButton.addEventListener("click", async () => {
	const response = await API.fetch("", `user/logout?access_token=${Cookies.get("access_token") || ""}`, "GET");
	if (response.status === "success") {
		Message.openToast("You have been logged out!", "Success", response.status);

		setTimeout(() => {
			window.location.replace(index);
		}, Message.redirect_time);
	}
});

joinButton.addEventListener("click", async (event) => {
	const token = await grecaptcha.execute("6LcOBhElAAAAANLxZEiq9CaWq8MgqSpFVoqxy3IG", { action: "validate_captcha" });

	const formData = new FormData(form);

	const pin = `${formData.get("pin1")}${formData.get("pin2")}${formData.get("pin3")}${formData.get("pin4")}`;

	const json = {
		id: formData.get("id"),
		password: pin,
		token,
	};
	const game = await API.fetch(json, `game/join?access_token=${Cookies.get("access_token") || ""}`, "POST");

	if (game.status === "success") {
		Message.openToast("You will be redirected in a second", "Success", game.status);

		Cookie.set("g_id", game.g_id);

		setTimeout(() => {
			window.location.replace(next);
		}, Message.redirect_time);
	} else {
		Message.openToast(game.message, "Error", game.status);
	}
});

/* PIN */

const pinContainer = document.querySelector(".pin-code");

pinContainer.addEventListener(
	"keyup",
	function (event) {
		const { target } = event;

		const maxLength = parseInt(target.attributes["maxlength"].value, 10);
		const myLength = target.value.length;

		if (myLength >= maxLength) {
			let next = target;
			while ((next = next.nextElementSibling)) {
				if (next == null) break;
				if (next.tagName.toLowerCase() == "input") {
					next.focus();
					break;
				}
			}
		}

		if (myLength === 0) {
			let next = target;
			while ((next = next.previousElementSibling)) {
				if (next == null) break;
				if (next.tagName.toLowerCase() == "input") {
					next.focus();
					break;
				}
			}
		}
	},
	false
);

pinContainer.addEventListener(
	"keydown",
	function (event) {
		const { target } = event;
		target.value = "";
	},
	false
);
