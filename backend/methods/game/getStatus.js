const mongoose = require("mongoose");

const { statusSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");
const Player = require("../../db/collections/player");

async function getStatus(game_id) {
  try {
    await statusSchema.validate({ game_id });

    const count = await Player.count({ game_id: new mongoose.Types.ObjectId(game_id) });
    const game = await Game.findOne({ _id: new mongoose.Types.ObjectId(game_id) });
    if (!game) return { status: "error", message: "An error has occured!" };

    return {
      status: "success",
      count,
      time: game.date,
      status: game.status,
    };
  } catch (error) {
    return error;
  }
}

module.exports = getStatus;
