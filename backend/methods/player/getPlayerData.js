const mongoose = require("mongoose");

const Player = require("../../db/collections/player");
const User = require("../../db/collections/user");
const Game = require("../../db/collections/game");
const Team = require("../../db/collections/team");
const Location = require("../../db/collections/location");

const { listPlayersSchema } = require("../../schemas/players");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

async function getPlayerData(player_id) {
  try {
    await listPlayersSchema.validate({ player_id });

    const player = await Player.findOne({ _id: new mongoose.Types.ObjectId(player_id) });
    const user = await User.findOne({ _id: player.user_id });
    const game = await Game.findOne({ _id: player.game_id });
    const team = await Team.findOne({ _id: player.team_id });
    const location = await Location.findOne({ _id: player.location_id });

    const data = {
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
    }

    return {
      status: "success",
      data
    };
  } catch (error) {
    return error;
  }
}

module.exports = getPlayerData;
