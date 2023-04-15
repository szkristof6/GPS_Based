const { getTeamSchema } = require("../../schemas/team");
const Team = require("../../db/collections/team");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    await getTeamSchema.validate(req.query);

    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const team = await Team.findOne({ _id: req.body.id, game_id: gameID.value });
    if (!team) return res.code(400).send({ status: "error", message: "This team does not exist!" });

    return res.send(team);
  } catch (error) {
    return res.send(error);
  }
};
