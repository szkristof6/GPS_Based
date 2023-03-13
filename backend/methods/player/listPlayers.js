const db = require("../../db");

const players = db.get("players");
const users = db.get("users");

/*
Lekérdezzük a token azonosítás után létrehozott user tömb segítségével a játékos adatait
Majd lekérdezzük a játékos játék azonosítója alapján a játékban lévő játékosokat
  Ebből a listából kivesszük a felhasználó adatait, hogy csak a többi játékos legyen megjelenítve a térképen

Majd visszaadjuk a végleges listát a felhasznló képével együtt
*/

async function listPlayers(req, res, next) {
  try {
    const player = await players.findOne({ user: req.user.user_id });
    const dbPlayers = await players.find({ game: req.body.game });

    const cleaned = []; // Létrehozunk egy üres listát

    for (let index = 0; index < dbPlayers.length; index++) {
      const element = dbPlayers[index]; // elmentjük az adott játékost egy változóval
      if (element.user != player.user) { // Megnézzük, hogy az adott játékos azonosítója egyezik-e a felhasználó azonosítójával
        const dbUser = await users.findOne({ _id: element.user }); // Ha nem, akkor lekérdezzük a játékos azonosítója alapján a felhasználói profilját
        cleaned.push({
          ...element,
          image: dbUser.image,
        }); // Betesszük a listába a kiegészített objektumot
      }
    }
    
    res.json(cleaned);
  } catch (error) {
    next(error);
  }
}

module.exports = listPlayers;
