const teams = require("../../db/teams");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function getTeam(req, res) {
  try {
    const team = await teams.findOne({ _id: req.body._id, game_id: req.body.game_id });

    res.send(team);
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested team does not exist!";
    }
    res.send(error);
  }
}

module.exports = getTeam;
