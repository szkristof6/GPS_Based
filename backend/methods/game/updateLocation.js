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
      res.send({
        status: "error",
        message: "The player was not found!",
      });

      return;
    } else {
      const created = await locations.insert({
        location: req.body.location,
        date: new Date(),
        player_id: player._id,
        game_id: player.game_id,
      });

      const updated = await players.findOneAndUpdate({ _id: player._id }, { $set: { location_id: created._id } });
      res.send({
        status: "success",
        updated,
      });

      return;
    }
  } catch (error) {
    res.send(error);

    return;
  }
}

module.exports = updateLocation;
