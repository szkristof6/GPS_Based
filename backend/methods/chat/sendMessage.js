const mongoose = require("mongoose");
const yup = require("yup");
const escapeHtml = require('escape-html')

require("dotenv").config();

const Message = require("../../collections/message");

const { trimmedString } = require("../../schema");

module.exports = async function (req, res) {
  try {
    //if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      message: trimmedString.max(255),
      receiver_type: trimmedString,
      receiver: trimmedString,
    });

    await schema.validate(req.body);

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const message = new Message({
      message: escapeHtml(req.body.message),
      receiver_type: escapeHtml(req.body.receiver_type),
      game_id: new mongoose.Types.ObjectId(gameID.value),
      sender_id: new mongoose.Types.ObjectId(req.user.user_id),
      receiver_id: new mongoose.Types.ObjectId(req.body.receiver_id),
    });

    await message.save();

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
