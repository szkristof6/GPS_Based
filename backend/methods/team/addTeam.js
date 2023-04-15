const mongoose = require("mongoose");

const { teamsSchema } = require("../../schemas/team");
const Team = require("../../db/collections/team");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    await teamsSchema.validate(req.body);

    const team = new Team({
      name: req.body.name,
      game_id: new mongoose.Types.ObjectId(req.body.game_id),
      point: 0,
      color: req.body.color,
    });

    await team.save();
    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
