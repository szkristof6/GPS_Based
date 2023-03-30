const bcrypt = require("bcrypt");

const crypto = require('crypto');

const { gamesSchema } = require("../../schemas/game");
const games = require("../../db/collections/games");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

async function createGame(req, res) {
  try {
    await gamesSchema.validate(req.body);

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const game = await games.insert({
      id: crypto.randomBytes(15).toString("hex"),
      name: req.body.name,
      password: hash,
      gamemode: "test",
      location: req.body.location,
      date: req.body.date,
      status: 0,
      createdAt: Date.now(),
    });
    return res.send({
      status: "success",
      game,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This game has already been created!";
    }
    return res.send(error);
  }
}

module.exports = createGame;
