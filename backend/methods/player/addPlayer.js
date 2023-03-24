const { playersSchema } = require("../../schemas/players");
const players = require("../../db/players");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

async function getPlayers(req, res) {
  try {
    await playersSchema.validate(req.body);

    const existing = await players.findOne({ game: req.body.game, user: req.user.user_id });
    if (existing) {
      res.send({
        status: "inplay",
      });
    }

    await players.insert({ ...req.body, user: req.user.user_id });
    res.send({
      status: "success",
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This username is already playing!";
    }
    res.send(error);
  }
}

module.exports = getPlayers;
