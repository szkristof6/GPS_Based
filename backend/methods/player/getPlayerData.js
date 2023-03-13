const db = require("../../db");

const players = db.get("players");
const users = db.get("users");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

async function getPlayerData(req, res, next) {
  try {
    const player = await players.findOne({ user: req.user.user_id });
    const user = await users.findOne({ _id: req.user.user_id });

    res.json({...player, ...user});
  } catch (error) {
    next(error);
  }
}

module.exports = getPlayerData;
