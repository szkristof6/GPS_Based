import*as API from"../api.js";import*as Cookie from"../cookie.js";const next="map.html",index="index.html";function remainingTime(e){const o=(new Date).getTime(),t=new Date(e).getTime()-o;return`${Math.floor(t/864e5)} days ${Math.floor(t%864e5/36e5)} hours ${Math.floor(t%36e5/6e4)} minutes ${Math.floor(t%6e4/1e3)} seconds left`}async function getData(e){const o=e.coords,t={game_id:Cookie.getCookie("GameID"),team_id:"6421789c49f8622312473347",location:{x:o.longitude,y:o.latitude}},n=await API.fetchPOST(t,"addPlayer");if("success"==n.status||"inplay"==n.status){console.log(n);const e=document.querySelector("#count"),o=document.querySelector("#time");e.querySelector(".ssc-line").style.display="none",e.querySelector("p").innerHTML=n.count,o.querySelector(".ssc-line").style.display="none",o.querySelector("p").innerHTML=remainingTime(n.time),setInterval((()=>{o.querySelector("p").innerHTML=remainingTime(n.time)}),1e3)}}document.addEventListener("DOMContentLoaded",(async()=>{Cookie.getCookie("Token")||window.location.replace(index),getLocation()})),window.addEventListener("load",(()=>{document.querySelector(".container").style.display="none"}));const getLocation=()=>navigator.geolocation.getCurrentPosition(getData,(e=>console.warn(`ERROR(${e.code}): ${e.message}`)),{enableHighAccuracy:!0,timeout:5e3,maximumAge:0});