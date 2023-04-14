const http = require("http");

let fastify_server;

const serverFactory = (handler, opts) => {
  fastify_server = http.createServer((req, res) => handler(req, res));
  return fastify_server;
};

const fastify = require("fastify")({ serverFactory });

require("dotenv").config();

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
fastify.register(import("@fastify/rate-limit"), { max: 100, timeWindow: "1 minute" });

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429);
    error.message = "You hit the rate limit! Slow down please!";
  }
  return reply.send(error);
});

module.exports = { fastify, fastify_server };
