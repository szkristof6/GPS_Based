const gamesSchema = require("../../schemas/game");
const db = require("../../db");

const games = db.get("games");
games.createIndex({ name: 1 }, { unique: true });

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

async function createGame(req, res, next) {
  try {
    await gamesSchema.validate(req.body);

    const game = await games.insert(req.body);
    res.json({
      status: "success",
      game,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This gas has already been created!";
    }
    next(error);
  }
}

module.exports = createGame;
