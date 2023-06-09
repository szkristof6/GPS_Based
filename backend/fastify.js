const http = require("http");
const path = require("path");

let fastify_server;

const serverFactory = (handler, opts) => {
  fastify_server = http.createServer((req, res) => handler(req, res));
  return fastify_server;
};

const fastify = require("fastify")({ serverFactory });

require("dotenv").config();

fastify.register(require("@fastify/multipart"), { });


fastify.register(require("fastify-socket.io"), {
  cors: {
    origin: process.env.NODE_ENV === "dev" ? "*" : process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  path: "/socket/",
});
fastify.register(require("@fastify/cookie"), {
  secret: process.env.COOKIE_SECRET,
  hook: "onRequest",
  parseOptions: {},
});
fastify.register(require("@fastify/cors"), {
  origin: process.env.CLIENT_URI,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});
fastify.register(require("@fastify/helmet"), { global: true });
fastify.register(require("@fastify/jwt"), {
  secret: process.env.TOKEN_KEY,
  verify: { allowedIss: "api.stagenex.hu" },
});
fastify.register(import("@fastify/rate-limit"), {
  max: 10,
  timeWindow: "10s",
  global: true,
  hook: "preHandler",
  addHeadersOnExceeding: {
    "x-ratelimit-limit": true,
    "x-ratelimit-remaining": true,
    "x-ratelimit-reset": true,
  },
});

module.exports = { fastify, fastify_server };
