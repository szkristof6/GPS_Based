require("dotenv").config();

const fastify = require("../fastify");

function JWT_sign(user) {
  const json = {
    user_id: user._id,
    username: user.username,
    iss: 'https://api.stagenex.hu'
  };
  const options = {
    expiresIn: "1d",
  };
  return fastify.jwt.sign(json, options);
}

module.exports = JWT_sign;
