const db = require("../../db");

const games = db.get("games");
games.createIndex({ name: 1 }, { unique: true });

/*
Ismét egy borzasztó egyszerű funkció, lekérdezi adatbázisból az összes játékot és visszaadja a kliensnek
*/

async function listGames(req, res, next) {
  try {
    const gameList = await games.find();
    res.json(gameList);
  } catch (error) {
    next(error);
  }
}

module.exports = listGames;
