const bcrypt = require("bcrypt");

const { nanoid } = require("nanoid");

const { gamesSchema } = require("../../schemas/game");
const games = require("../../db/games");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

async function createGame(req, res) {
  try {
    await gamesSchema.validate(req.body);

    const saltRounds = 5;
    const hash = await bcrypt.genSalt(saltRounds).then((salt) => bcrypt.hash(req.body.password, salt));

    const game = await games.insert({
      id: nanoid(15),
      name: req.body.name,
      password: hash,
      gamemode: "test",
      location: req.body.location,
      date: req.body.date,
      status: "join"
    });
    res.send({
      status: "success",
      game,
    });

    return;
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This game has already been created!";
    }
    res.send(error);

    return;
  }
}

module.exports = createGame;
