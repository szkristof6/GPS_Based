const { getTeamSchema } = require("../../schemas/team");
const teams = require("../../db/collections/teams");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function getTeam(req, res) {
  try {
    await getTeamSchema.validate(req.body);

    const team = await teams.findOne({ _id: req.body.id, game_id: req.body.game_id });

    return res.send(team);
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested team does not exist!";
    }
    return res.send(error);
  }
}

module.exports = getTeam;
