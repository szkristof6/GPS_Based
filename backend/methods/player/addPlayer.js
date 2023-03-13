const { playersSchema } = require("../../schemas/players");
const db = require("../../db");

const players = db.get("players");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

async function getPlayers(req, res, next) {
  try {
    await playersSchema.validate(req.body);

    const existing = await players.findOne({ game: req.body.game, user: req.user.user_id });
    if (existing) {
      res.json({
        status: "inplay",
      });
    }

    const created = await players.insert({ ...req.body, user: req.user.user_id });
    res.json({
      status: "success",
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This username is already playing!";
    }
    next(error);
  }
}

module.exports = getPlayers;
