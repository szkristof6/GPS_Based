const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  path: "/socket/"
});

module.exports = {io, httpServer};