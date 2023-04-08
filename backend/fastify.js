const http = require("http");

let fastify_server;

const serverFactory = (handler, opts) => {
  fastify_server = http.createServer((req, res) => handler(req, res));
  return fastify_server;
};

const fastify = require("fastify")({ serverFactory });

require("dotenv").config();

fastify.register(require("fastify-socket.io"), {
  cors: {
    origin: process.env.NODE_ENV === "dev" ? "*" : process.env.CLIENT_URI,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
  path: "/socket/",
});

fastify.register(require("@fastify/cors"), {
  origin: process.env.NODE_ENV === "dev" ? "*" : process.env.CLIENT_URI,
});
fastify.register(require("@fastify/helmet"), { global: true });
fastify.register(require("@fastify/jwt"), { secret: process.env.TOKEN_KEY });
fastify.register(import("@fastify/rate-limit"), {
  max: 100,
  timeWindow: "1 minute",
});

fastify.setErrorHandler(function (error, request, reply) {
  if (error.statusCode === 429) {
    reply.code(429);
    error.message = "You hit the rate limit! Slow down please!";
  }
  return reply.send(error);
});

fastify.decorate("verify", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.send(error);
  }
});

module.exports = { fastify, fastify_server };
