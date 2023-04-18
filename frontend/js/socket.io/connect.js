import backend_uri from "../api.js";
import { io } from "./socket.io.esm.min.js";
import Cookies from "../js.cookie.min.mjs";

const socket = () => io(backend_uri, {
  path: "/socket/",
  query: {
    token: Cookies.get('token')
  }
});

export default socket;