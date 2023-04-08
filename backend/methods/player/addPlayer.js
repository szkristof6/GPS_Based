const mongoose = require("mongoose");

const { playersSchema } = require("../../schemas/players");
const Player = require("../../db/collections/player");
const Location = require("../../db/collections/location");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

async function addPlayer(req, res) {
  try {
    await playersSchema.validate(req.body);

    const game_id = new mongoose.Types.ObjectId(req.body.game_id);
    const user_id = new mongoose.Types.ObjectId(req.user.user_id);
    const team_id = new mongoose.Types.ObjectId(req.body.team_id);

    const existing = await Player.findOne({ game_id, user_id });
    if (existing) return res.header("p_id", existing._id).send({ status: "inplay", player_id: existing._id });

    const player_id = new mongoose.Types.ObjectId();

    const location = new Location({
      _id: new mongoose.Types.ObjectId(),
      location: req.body.location,
      player_id,
      game_id,
    });

    const player = new Player({
      _id: player_id,
      user_id,
      game_id,
      location_id: location._id,
      team_id,
      point: 0,
    });

    await location.save();
    await player.save();

    return res.header("p_id", player_id.toString()).send({ status: "success", player_id: player_id.toString()});
  } catch (error) {
    return res.send(error);
  }
}

module.exports = addPlayer;
