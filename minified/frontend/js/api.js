import*as Cookie from"./cookie.js";const backend_uri="https://api.stagenex.hu";export default backend_uri;export async function fetchPOST(o,t){const e=Cookie.getCookie("Token"),n=await fetch(`${backend_uri}/${t}`,{method:"POST",headers:{Accept:"application.json","Content-Type":"application/json",Authorization:`Bearer ${e}`},body:JSON.stringify(o)});return await n.json()}export async function fetchGET(o){const t=Cookie.getCookie("Token"),e=await fetch(`${backend_uri}/${o}`,{method:"GET",headers:{Accept:"application.json","Content-Type":"application/json",Authorization:`Bearer ${t}`}});return await e.json()}