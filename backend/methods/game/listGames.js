const games = require("../../db/games");

/*
Ismét egy borzasztó egyszerű funkció, lekérdezi adatbázisból az összes játékot és visszaadja a kliensnek
*/

async function listGames(req, res) {
  try {
    const gameList = await games.find();
    res.send(gameList);
  } catch (error) {
    res.send(error);
  }
}

module.exports = listGames;
