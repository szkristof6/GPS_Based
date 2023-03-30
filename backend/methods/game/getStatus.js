const { statusSchema } = require("../../schemas/game");
const games = require("../../db/collections/games");
const players = require("../../db/collections/players");

async function getStatus(req, res) {
  try {
    await statusSchema.validate(req.query);

    const count = await players.count({ game_id: req.query.game_id });
    const game = await games.findOne({ _id: req.query.game_id });
    if (game === null) {
      return res.send({
        status: "error",
        message: "An error has occured!",
      });
    }

    return res.send({
      status: "success",
      count,
      time: game.date,
      status: game.status,
    });
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    return res.send(error);
  }
}

module.exports = getStatus;
