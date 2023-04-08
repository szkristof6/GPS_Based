const mongoose = require("mongoose");

const Player = require("../../db/collections/player");
const Location = require("../../db/collections/location");
const { locationSchema } = require("../../schemas/game");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

async function updateLocation(object) {
  try {
    await locationSchema.validate(object);
    const player = await Player.findOne({ _id: object.player_id });

    if (!player) return { status: "error", message: "The player was not found!" };

    const location = new Location({
      location: object.location,
      player_id: player._id,
      game_id: player.game_id,
    });

    const savedLocation = await location.save();

    await Player.updateOne({ _id: savedLocation.player_id }, { $set: { location_id: savedLocation._id } });
    return { status: "success" };
  } catch (error) {
    return error;
  }
}

module.exports = updateLocation;
