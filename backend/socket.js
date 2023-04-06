const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const socket_server = createServer();
const io = new Server(socket_server, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  path: "/socket/"
});

module.exports = {io, socket_server};