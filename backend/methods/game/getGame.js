const games = require("../../db/games");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function getGame(req, res) {
  try {
    const game = await games.findOne({ id: req.body.id });

    res.send(game);
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    res.send(error);
  }
}

module.exports = getGame;
