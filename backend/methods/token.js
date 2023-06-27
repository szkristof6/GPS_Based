const bcrypt = require("bcrypt");
const crypto = require("crypto");

require("dotenv").config();

const Token = require("../collections/token");

async function insertToken(user_id, method) {
  const existing = await Token.countDocuments({ user_id }).then((num) => num === 1);
  if (existing) await Token.deleteOne({ user_id });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(resetToken, salt));

  const newToken = {
    user_id,
    token: hash,
    method,
    createdAt: new Date(),
  };
  await Token.insertOne(newToken);

  return resetToken;
}

async function verifyToken(user_id, method, minutes) {
  const userVerifyToken = await Token.findOne({ user_id });
  if (!userVerifyToken || userVerifyToken.method !== method)
    return { status: "error", message: "Invalid or expired password reset token!" };

  const delta = Date.now() - userVerifyToken.createdAt;

  if (delta >= minutes * 60 * 1000) return { status: "error", message: "Invalid or expired password reset token!" };

  return { status: "valid", token: userVerifyToken.token };
}

async function removeToken(user_id) {
  const query = await Token.deleteOne({ user_id });

  return query;
}

module.exports = { insertToken, verifyToken, removeToken };
