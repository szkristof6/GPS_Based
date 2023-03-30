const { teamsSchema } = require("../../schemas/team");
const teams = require("../../db/teams");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

async function addTeam(req, res) {
  try {
    await teamsSchema.validate(req.body);

    const team = await teams.insert({
      name: req.body.name,
      game_id: req.body.game_id,
      point: 0,
      color: req.body.color,
      createdAt: Date.now(),
    });
    return res.send({
      status: "success",
      team,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This gas has already been created!";
    }
    return res.send(error);
  }
}

module.exports = addTeam;
