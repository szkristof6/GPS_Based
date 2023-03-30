const { playersSchema } = require("../../schemas/players");
const players = require("../../db/collections/players");
const locations = require("../../db/collections/locations");
const games = require("../../db/collections/games");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e
Ha igen megnézzük, hogy létezik-e a játékos,
  Ha igen, akkor visszaadjuk, hogy játszik már

Ha nem, akkor eltároljuk az adatbázisban és visszatérünk..
*/

async function getPlayers(req, res) {
  try {
    await playersSchema.validate(req.body);

    const existing = await players.findOne({ game_id: req.body.game_id, user_id: req.user.user_id });
    if (existing !== null) {
      const count = await players.count({ game_id: existing.game_id });
      const game = await games.findOne({ _id: existing.game_id });

      return res.send({
        status: "inplay",
        player_id: existing._id,
        count,
        time: game.date,
      });
    }

    const created = await players.insert({
      user_id: req.user.user_id,
      game_id: req.body.game_id,
      location_id: null,
      team_id: req.body.team_id,
      point: 0,
      createdAt: Date.now(),
    });

    const location = await locations.insert({
      location: req.body.location,
      player_id: created._id,
      game_id: created.game_id,
      date: Date.now(),
    });

    const updated = await players.findOneAndUpdate({ _id: created._id }, { $set: { location_id: location._id } });

    const count = await players.count({ game_id: created.game_id });
    const game = await games.findOne({ _id: created.game_id });

    return res.send({
      status: "success",
      player_id: updated._id,
      count,
      time: game.date,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = "This username is already playing!";
    }
    return res.send(error);
  }
}

module.exports = getPlayers;
