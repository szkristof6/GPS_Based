require("dotenv").config();

const setCookie = (name, value, reply) =>
  reply.setCookie(name, value, {
    domain: "",
    path: "/",
    signed: true,
    secure: "auto",
    httpOnly: true
  });

module.exports = setCookie;
