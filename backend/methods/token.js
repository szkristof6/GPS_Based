const bcrypt = require("bcrypt");
const monk = require("monk");
const crypto = require("crypto");

require("dotenv").config();

const tokens = require("../db/collections/tokens");

async function insertToken(id, method) {
  const token = await tokens.findOne({ user_id: id });
  if (token) await tokens.remove({ user_id: id });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(resetToken, salt));

  await tokens.insert({
    user_id: id,
    token: hash,
    method,
    createdAt: Date.now(),
  });

  return resetToken;
}

async function verifyToken(id, method, minutes) {
  const userVerifyToken = await tokens.findOne({ user_id: monk.id(id) });
  if (userVerifyToken === null || userVerifyToken.method !== method) {
    return {
      status: "error",
      message: "Invalid or expired password reset token!",
    };
  }

  const currentTime = Date.now();
  const delta = currentTime - userVerifyToken.createdAt;

  if (delta >= minutes * 60 * 1000) {
    return {
      status: "error",
      message: "Invalid or expired password reset token!",
    };
  }

  return { status: "valid" };
}

async function removeToken(id) {
  const query = await tokens.remove({ user_id: monk.id(id) });

  return query;
}

module.exports = { insertToken, verifyToken, removeToken };
