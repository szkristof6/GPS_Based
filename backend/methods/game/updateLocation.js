const players = require("../../db/collections/players");
const locations = require("../../db/collections/locations");
const { locationSchema } = require("../../schemas/game");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

async function updateLocation(object) {
  try {
    await locationSchema.validate(object);
    const player = await players.findOne({ _id: object.player_id });

    if (!player) {
      return {
        status: "error",
        message: "The player was not found!",
      };
    } else {
      const created = await locations.insert({
        location: object.location,
        date: Date.now(),
        player_id: player._id,
        game_id: player.game_id,
      });

      const updated = await players.findOneAndUpdate({ _id: player._id }, { $set: { location_id: created._id } });
      return {
        status: "success",
        updated,
      };
    }
  } catch (error) {
    return error;
  }
}

module.exports = updateLocation;
