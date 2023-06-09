const mongoose = require("mongoose");

const Game = require("../../collections/game");

module.exports = async function (req, res) {
  try {
    // if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const game = await Game.find();

    const reducedGames = game.map((item) => ({ name: item.name, id: item._id }));

    return res.send({
      status: "success",
      game: reducedGames,
    });
  } catch (error) {
    return res.send(error);
  }
};
