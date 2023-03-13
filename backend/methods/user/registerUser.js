const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = require("../../schemas/user");
const db = require("../../db");

const users = db.get("users"); // Az adatbázisból lekérjük az users táblát
users.createIndex({ username: 1 }, { unique: true }); // Az users táblában megmondjuk, hogy az username egy unique elem

async function registerUser(req, res, next) {
  try {
    await userSchema.validate(req.body); // A kliens felöl érkező adatokat ellenőrizzük egy schema alapján

    /*
    Sikeres ellenörzés után betesszük az adatbázisba a felhasználót
    Megadunk egy teszt képet és egy hozzáférési szintet
    */
    const user = await users.insert({
      ...req.body,
      image: `https://eu.ui-avatars.com/api/?name=${req.body.username}&size=250`,
      permission: 0
    });
    /*
    Létrehozzuk a felhasználühüz tartozó tokent, amit visszaadunk sikeres művelet eseten a kliensnek
    */
    const token = jwt.sign({ user_id: user._id, username: req.body.username }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.json({
      status: "success",
      token,
    });
  } catch (error) {
    // Minden hiba esetén ide kerülünk, ahol kezeljük a hibát, vagy továbbküldjük a hibakezelőnek
    if (error.message.startsWith("E11000")) { // A duplicate hiba így kezdődik
      error.message = "This username is already exists!";
    }
    next(error);
  }
}

module.exports = registerUser;
