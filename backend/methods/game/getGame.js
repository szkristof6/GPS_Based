const mongoose = require("mongoose");

const { statusSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");

async function getGame(req, res) {
  try {
    await statusSchema.validate(req.query);

    const game = await Game.findOne({ _id: new mongoose.Types.ObjectId(req.query.game_id) });

    return res.send({
      status: "success",
      game: {
        location: game.location,
        status: game.status,
      },
    });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = getGame;
