const mongoose = require("mongoose");

const Game = require("../../collections/game");
const Team = require("../../collections/team");

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    
    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const game = await Game.findOne({ _id: new mongoose.Types.ObjectId(gameID.value) });
    const teams = await Team.find({ game_id: game._id });

    return res.send({
      status: "success",
      teams: teams.map((team) => ({ image: team.image, id: team._id })),
    });
  } catch (error) {
    return res.send(error);
  }
};
