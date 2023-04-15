const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

require("dotenv").config();

const Token = require("../collections/token");

async function insertToken(id, method) {
const user_id = new mongoose.Types.ObjectId(id);

  const existing = await Token.findOne({ user_id });
  if (existing) await Token.removeOne({ user_id });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(resetToken, salt));

  const token = new Token({
    user_id,
    token: hash,
    method,
  });
  await token.save();

  return resetToken;
}

async function verifyToken(id, method, minutes) {
  const userVerifyToken = await Token.findOne({ user_id: new mongoose.Types.ObjectId(id) });
  if (!userVerifyToken || userVerifyToken.method !== method)
    return { status: "error", message: "Invalid or expired password reset token!" };

  const delta = Date.now() - userVerifyToken.createdAt;

  if (delta >= minutes * 60 * 1000) return { status: "error", message: "Invalid or expired password reset token!" };

  return { status: "valid", token: userVerifyToken.token };
}

async function removeToken(id) {
  const query = await Token.deleteOne({ user_id: new mongoose.Types.ObjectId(id) });

  return query;
}

module.exports = { insertToken, verifyToken, removeToken };
