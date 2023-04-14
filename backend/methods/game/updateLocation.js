const mongoose = require("mongoose");

const Player = require("../../db/collections/player");
const Location = require("../../db/collections/location");
const { locationSchema } = require("../../schemas/game");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

async function updateLocation(req, res) {
  try {
    const playerID = req.unsignCookie(req.cookies.p_id);
    if (!playerID.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    await locationSchema.validate(req.body);

    const player = await Player.findOne({ _id: playerID.value });
    if (!player) return res.code(400).send({ status: "error", message: "The player was not found!" });

    const location = new Location({
      location: req.body.location,
      player_id: player._id,
      game_id: player.game_id,
    });

    const savedLocation = await location.save();

    await Player.updateOne({ _id: savedLocation.player_id }, { $set: { location_id: savedLocation._id } });
    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = updateLocation;
