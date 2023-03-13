const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = require("../../schemas/user");
const db = require("../../db");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

const users = db.get("users");
users.createIndex({ username: 1 }, { unique: true });

async function loginUser(req, res, next) {
  try {
    await userSchema.validate(req.body);

    const user = await users.findOne({ username: req.body.username });
    const token = jwt.sign({ user_id: user._id, username: req.body.username }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.json({
      status: "success",
      token,
    });
  } catch (error) {
    if (error.message.startsWith("Cannot")) { // Ha nem létezik a felhasználó, akkor így kezdődik a hiba
      error.message = "This user does not exist! Please sign in!";
    }
    next(error);
  }
}

module.exports = loginUser;
