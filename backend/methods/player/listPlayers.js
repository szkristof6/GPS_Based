const mongoose = require("mongoose");

const Player = require("../../db/collections/player");
const User = require("../../db/collections/user");
const Game = require("../../db/collections/game");
const Team = require("../../db/collections/team");
const Location = require("../../db/collections/location");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Majd lekérdezzük a játékos játék azonosítója alapján a játékban lévő játékosokat
  Ebből a listából kivesszük a felhasználó adatait, hogy csak a többi játékos legyen megjelenítve a térképen

Majd visszaadjuk a végleges listát a felhasznló képével együtt
*/

async function listPlayers(req, res) {
  try {
    const gameID = req.unsignCookie(req.cookies.g_id);
    if (!gameID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const players = await Player.find({ game_id: new mongoose.Types.ObjectId(gameID.value) });
    if (!players) return res.code(400).send({ status: "error", message: "There are zero players in this game!" });

    const cleaned = []; // Létrehozunk egy üres listát

    for (const player of players) {

      if (player.user_id.toString() !== req.user.user_id) {
        const user = await User.findOne({ _id: player.user_id });
        const team = await Team.findOne({ _id: player.team_id });
        const location = await Location.findOne({ _id: player.location_id });

        cleaned.push({
          user: {
            name: user.name,
            image: user.image,
          },
          team: {
            color: team.color,
          },
          location: location.location,
        });
      }
    }

    return res.send({ status: "success", count: cleaned.length, players: cleaned });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = listPlayers;
