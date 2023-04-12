require("dotenv").config();

const { fastify } = require("../fastify");

function JWT_sign(user, expiresIn) {
  return fastify.jwt.sign({ user_id: user._id }, { expiresIn });
}

module.exports = JWT_sign;
