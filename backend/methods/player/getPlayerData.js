const mongoose = require("mongoose");

const Player = require("../../db/collections/player");
const User = require("../../db/collections/user");
const Game = require("../../db/collections/game");
const Team = require("../../db/collections/team");
const Location = require("../../db/collections/location");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Mjad lekérdezzük a felhasználó adatokat és együtt visszaadjuk
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const playerID = req.unsignCookie(req.cookies.p_id);
    if (!playerID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const player = await Player.findOne({ _id: new mongoose.Types.ObjectId(playerID.value) });
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
    };

    return res.send({
      status: "success",
      data,
    });
  } catch (error) {
    return res.send(error);
  }
};
