const mongoose = require("mongoose");

const Game = require("../../db/collections/game");
const Player = require("../../db/collections/player");

async function getStatus(req, res) {
  try {
    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const count = await Player.count({ game_id: new mongoose.Types.ObjectId(gameID.value) });
    const game = await Game.findOne({ _id: new mongoose.Types.ObjectId(gameID.value) });
    if (!game) return { status: "error", message: "An error has occured!" };

    return res.send({
      status: "success",
      game:{
        count,
        time: game.date,
        status: game.status,
      }
    });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = getStatus;
