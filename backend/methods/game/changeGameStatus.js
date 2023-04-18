const mongoose = require("mongoose");
const escapeHtml = require('escape-html')

const Game = require("../../collections/game");
const Moderator = require("../../collections/moderator");
const User = require("../../collections/user");

const states = {
  inactive: 0,
  waiting: 1,
  started: 2,
  paused: 3,
  resume: 2,
  ended: 4,
};

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const stateChange = escapeHtml(req.url.split("/").pop());
    const change = states[stateChange];
    if (!change) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const game_id = new mongoose.Types.ObjectId(gameID.value);
    const user_id = new mongoose.Types.ObjectId(req.user.user_id);

    const isModerator = await Moderator.findOne({ game_id, user_id }).then((moderator) => (moderator ? true : false));
    const isAdmin = await User.findOne({ _id: user_id }).then((user) => (user.permission === 10 ? true : false));
    if (!isModerator || !isAdmin) return res.code(400).send({ status: "error", message: "Not allowed!" });

    await Game.updateOne({ _id: game_id }, { $set: { status: change } });

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
