const players = require("../../db/collections/players");
const users = require("../../db/collections/users");
const games = require("../../db/collections/games");
const teams = require("../../db/collections/teams");
const locations = require("../../db/collections/locations");

const { listPlayersSchema } = require("../../schemas/players");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

async function getPlayerData(player_id) {
  try {
    await listPlayersSchema.validate({ player_id });

    const player = await players.findOne({ _id: player_id });
    const user = await users.findOne({ _id: player.user_id });
    const game = await games.findOne({ _id: player.game_id });
    const team = await teams.findOne({ _id: player.team_id });
    const location = await locations.findOne({ _id: player.location_id });

    return {
      status: "success",
      player: {
        point: player.point,
      },
      user: {
        name: user.name,
        image: user.image,
        permission: user.permission,
      },
      game: {
        name: game.name,
        gamemode: game.gamemode,
        location: game.location,
        date: game.date,
        objects: game.objects,
      },
      team: {
        name: team.name,
        point: team.point,
        color: team.color,
      },
      location: location.location,
    };
  } catch (error) {
    return error;
  }
}

module.exports = getPlayerData;
