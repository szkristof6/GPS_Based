const players = require("../../db/players");
const locations = require("../../db/locations");
const { locationSchema } = require("../../schemas/game");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

async function updateLocation(req, res) {
  try {
    await locationSchema.validate(req.body);
    const player = await players.findOne({ _id: req.body.player_id });

    if (!player) {
      return res.send({
        status: "error",
        message: "The player was not found!",
      });

    } else {
      const created = await locations.insert({
        location: req.body.location,
        date: Date.now(),
        player_id: player._id,
        game_id: player.game_id,
      });

      const updated = await players.findOneAndUpdate({ _id: player._id }, { $set: { location_id: created._id } });
      return res.send({
        status: "success",
        updated,
      });
    }
  } catch (error) {
    return res.send(error);
  }
}

module.exports = updateLocation;
