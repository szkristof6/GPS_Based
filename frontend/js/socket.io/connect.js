import backend_uri from "../api.js";
import { io } from "./socket.io.esm.min.js";

const socket = io(backend_uri, {
  path: "/socket/"
});

export default socket;