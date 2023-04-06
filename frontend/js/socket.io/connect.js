import backend_uri from "../api.js";
import { io } from "./socket.io.esm.min.js";

const socket = io(backend_uri);

export default socket;