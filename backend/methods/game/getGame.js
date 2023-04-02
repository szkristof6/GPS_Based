const { statusSchema } = require("../../schemas/game");
const games = require("../../db/collections/games");

async function getGame(req, res, next) {
  try {
    await statusSchema.validate(req.query);

    const game = await games.findOne({ _id: req.query.game_id });

    res.send({
      status: "success",
      game: {
        location: game.location,
        status: game.status,
      },
    });
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    res.send(error);
  }
}

module.exports = getGame;
