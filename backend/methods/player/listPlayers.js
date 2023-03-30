const { listPlayersSchema } = require("../../schemas/players");

const players = require("../../db/players");
const users = require("../../db/users");
const games = require("../../db/games");
const teams = require("../../db/teams");
const locations = require("../../db/locations");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Majd lekérdezzük a játékos játék azonosítója alapján a játékban lévő játékosokat
  Ebből a listából kivesszük a felhasználó adatait, hogy csak a többi játékos legyen megjelenítve a térképen

Majd visszaadjuk a végleges listát a felhasznló képével együtt
*/

async function listPlayers(req, res) {
  try {
    await listPlayersSchema.validate(req.query);

    const player = await players.findOne({ _id: req.query.player_id });
    const allPlayer = await players.find({ game_id: player.game_id });

    const cleaned = []; // Létrehozunk egy üres listát

    for (let index = 0; index < allPlayer.length; index++) {
      const element = allPlayer[index]; // elmentjük az adott játékost egy változóval
      if (element.player_id !== player.player_id) {
        // Megnézzük, hogy az adott játékos azonosítója egyezik-e a felhasználó azonosítójával
        const user = await users.findOne({ _id: element.user_id });
        const team = await teams.findOne({ _id: element.team_id });
        const location = await locations.findOne({ _id: element.location_id }); // Ha nem, akkor lekérdezzük a játékos azonosítója alapján a felhasználói profilját

        cleaned.push({
          user: {
            name: user.name,
            image: user.image,
          },
          team: {
            color: team.color,
          },
          location: location.location,
        }); // Betesszük a listába a kiegészített objektumot
      }
    }

    return res.send({ status: "success", count: cleaned.length, players: cleaned });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = listPlayers;
