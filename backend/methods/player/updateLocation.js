const db = require("../../db");
const { locationSchema } = require("../../schemas/players");

const players = db.get("players");

/*
Megnézzük, hogy a kliens által megadott értékek megfelelőek-e
Amennyiben helyesek megkeressük az adott játékost a token azonosítás után létrehozott user tömb segítségével
Majd frissítjük a játékos pozicióját
*/

async function updateLocation(req, res, next) {
  try {
    await locationSchema.validate(req.body);
    const player = await players.findOne({user: req.user.user_id});

    const updated = await players.findOneAndUpdate(
      { _id: player._id },
      { $set: { location: req.body.location } }
    );
    res.json({
      status: "success"
    });
  } catch (error) {
    next(error);
  }
}

module.exports = updateLocation;
