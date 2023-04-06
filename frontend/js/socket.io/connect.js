import backend_uri from "../api.js";
import { io } from "./socket.io.esm.min.js";

const socket = io("https://socket.stagenex.hu:500", {
  path: "/socket/"
});

export default socket;