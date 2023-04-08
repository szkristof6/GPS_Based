const { listPlayersSchema } = require("../../schemas/players");

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

async function listPlayers(player_id) {
  try {
    await listPlayersSchema.validate({ player_id });

    const player = await Player.findOne({ _id: player_id });
    if (!player) return { status: "error", message: "This player cannot be found!" };
    const players = await Player.find({ game_id: player.game_id });
    if(!players) return { status: "error", message: "There are zero players in this game!" };

    const cleaned = []; // Létrehozunk egy üres listát

    for (const element of players) {
      if (element.user_id.toString() !== player.user_id.toString()) {
        const user = await User.findOne({ _id: element.user_id });
        const team = await Team.findOne({ _id: element.team_id });
        const location = await Location.findOne({ _id: element.location_id });

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

    return { status: "success", count: cleaned.length, players: cleaned };
  } catch (error) {
    return error;
  }
}

module.exports = listPlayers;
