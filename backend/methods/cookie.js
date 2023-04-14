require("dotenv").config();

const setCookie = (name, value, reply) =>
  reply.setCookie(name, value, {
    domain: "",
    path: "/",
    signed: true,
    secure: "auto",
    httpOnly: true,
  });

const clearCookie = (name, reply) => reply.clearCookie(name, { path: "/" });

module.exports = { setCookie, clearCookie };
