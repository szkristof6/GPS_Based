const games = require("../../db/games");
const players = require("../../db/players");

async function getStatus(req, res) {
  try {
    const count = await players.count({ game_id: req.query.game_id });
    const game = await games.findOne({ _id: req.query.game_id });
    if (game === null) {
      res.send({
        status: "error",
        message: "An error has occured!",
      });

      return;
    }

    res.send({
      status: "success",
      count,
      time: game.date,
      status: game.status,
    });
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    res.send(error);

    return;
  }
}

module.exports = getStatus;
