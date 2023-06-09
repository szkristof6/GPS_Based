const mongoose = require("mongoose");

const Game = require("../../collections/game");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const game = await Game.findOne({ _id: new mongoose.Types.ObjectId(gameID.value) });

    

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
};
