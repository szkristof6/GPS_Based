import*as API from"../api.js";import*as Cookie from"../cookie.js";const next="waiting.html",index="index.html";document.addEventListener("DOMContentLoaded",(()=>{Cookie.getCookie("Token")||window.location.replace(index)})),window.addEventListener("load",(()=>{document.querySelector(".container").style.display="none"}));const form=document.querySelector("form"),joinButton=document.querySelector("#JoinRoom"),logoutButton=document.querySelector("#logout");console.log("6O13_2qXHJyV_lK"),console.log("teszt123"),form.addEventListener("submit",(e=>e.preventDefault())),logoutButton.addEventListener("click",(()=>{Cookie.eraseCookie("Token"),window.location.replace(index)})),joinButton.addEventListener("click",(async e=>{const o=new FormData(form),t={id:o.get("id"),password:o.get("password"),token:o.get("g-recaptcha-response")},n=await API.fetchPOST(t,"getGameID");"success"===n.status?(Cookie.setCookie("GameID",n.id,Cookie.exp_time),window.location.replace(next)):console.error(n)}));