import * as API from "../../js/api.js";
import * as Message from "../../js/toast.js";

const admin = "admin/";
const index = "/index.html";

window.addEventListener("load", () => {
	API.fetch("", `page/verify?access_token=${Cookies.get("access_token") || ""}`, "GET").then((response) => {
		if (response.status === "disallowed" || response.next === "join") window.location.replace(index);
	});
});

// Get the HTML element
const menu1 = document.getElementById("menu_1");
const menu2 = document.getElementById("menu_2");
const menu3 = document.getElementById("menu_3");
const menu4 = document.getElementById("menu_4");
const menu5 = document.getElementById("menu_5");
const iframe = document.getElementById("iframe");

//liasteners
menu1.addEventListener("click", function () {
	console.log("Menu 1 clicked!");
	iframe.src = "pages/welcome.html";
});

menu2.addEventListener("click", function () {
	console.log("Menu 2 clicked!");
	iframe.src = "pages/mapsave.html";
});

menu3.addEventListener("click", function () {
	console.log("Menu 3 clicked!");
	iframe.src = "pages/mapmode.html";
});

menu4.addEventListener("click", function () {
	console.log("Menu 4 clicked!");
	iframe.src = "pages/mapsim.html";
});

menu5.addEventListener("click", function () {
	console.log("Menu 5 clicked!");
	iframe.src = "pages/admin.html";
});

const list = document.querySelectorAll(".list");
function activelink() {
	list.forEach((item) => item.classList.remove("active"));
	this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activelink));
