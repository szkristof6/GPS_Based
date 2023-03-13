const db = require("../../db");

const games = db.get("games");
games.createIndex({ name: 1 }, { unique: true });

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk a játék azonosítóját
*/

async function getGame(req, res, next) {
  try {
    const game = await games.findOne({ _id: req.body.id });

    res.json({ status: "success", id: game._id });
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    next(error);
  }
}

module.exports = getGame;
