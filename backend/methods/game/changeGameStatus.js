const mongoose = require("mongoose");
const escapeHtml = require("escape-html");

const Game = require("../../collections/game");
const Moderator = require("../../collections/moderator");

const states = {
  inactive: 0,
  waiting: 1,
  start: 2,
  pause: 3,
  resume: 2,
  stop: 4,
};

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed! 1" });

    const stateChange = escapeHtml(req.url.split("/").pop());
    const change = states[stateChange];
    if (!change) return res.code(400).send({ status: "error", message: "Not allowed! 2" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed! 3" });

    const game_id = new mongoose.Types.ObjectId(gameID.value);
    const user_id = new mongoose.Types.ObjectId(req.user.user_id);

    const isModerator = await Moderator.findOne({ game_id, user_id }).then((moderator) => (moderator ? true : false));
    const isAdmin = req.user.permission === 10 ? true : false;

    if (isModerator || isAdmin) await Game.updateOne({ _id: game_id }, { $set: { status: change } });
    else return res.code(400).send({ status: "error", message: "Not allowed! 4" });

    return res.send({ status: "success", newStatus: change });
  } catch (error) {
    return res.send(error);
  }
};
