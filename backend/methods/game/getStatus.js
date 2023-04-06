const { statusSchema } = require("../../schemas/game");
const games = require("../../db/collections/games");
const players = require("../../db/collections/players");

async function getStatus(game_id) {
  try {
    await statusSchema.validate({ game_id });

    const count = await players.count({ game_id });
    const game = await games.findOne({ _id: game_id });
    if (game === null) {
      return {
        status: "error",
        message: "An error has occured!",
      };
    }

    return {
      status: "success",
      count,
      time: game.date,
      status: game.status,
    };
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    return error;
  }
}

module.exports = getStatus;
