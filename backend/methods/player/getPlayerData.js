const players = require("../../db/players");
const users = require("../../db/users");


/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

async function getPlayerData(req, res) {
  try {
    const player = await players.findOne({ user: req.user.user_id });
    const user = await users.findOne({ _id: req.user.user_id });

    res.send({...player, ...user});
  } catch (error) {
    res.send(error);
  }
}

module.exports = getPlayerData;
