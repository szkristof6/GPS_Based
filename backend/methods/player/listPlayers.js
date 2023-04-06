const { listPlayersSchema } = require("../../schemas/players");

const players = require("../../db/collections/players");
const users = require("../../db/collections/users");
const games = require("../../db/collections/games");
const teams = require("../../db/collections/teams");
const locations = require("../../db/collections/locations");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Majd lekérdezzük a játékos játék azonosítója alapján a játékban lévő játékosokat
  Ebből a listából kivesszük a felhasználó adatait, hogy csak a többi játékos legyen megjelenítve a térképen

Majd visszaadjuk a végleges listát a felhasznló képével együtt
*/

async function listPlayers(player_id) {
  try {
    await listPlayersSchema.validate({ player_id });

    const player = await players.findOne({ _id: player_id });
    const allPlayer = await players.find({ game_id: player.game_id });

    const cleaned = []; // Létrehozunk egy üres listát

    for (let index = 0; index < allPlayer.length; index++) {
      const element = allPlayer[index];

      if (element.user_id !== player.user_id) {
        const user = await users.findOne({ _id: element.user_id });
        const team = await teams.findOne({ _id: element.team_id });
        const location = await locations.findOne({ _id: element.location_id });

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
