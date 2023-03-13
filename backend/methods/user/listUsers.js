const db = require("../../db");

const users = db.get("users");
users.createIndex({ username: 1 }, { unique: true });

/*
Borzasztó egyszerű funkció, lekérdezi adatbázisból az összes felhasználót és visszaadja a kliensnek
*/

async function loginUser(req, res, next) {
  try {
    const userList = await users.find();
    res.json(userList);
  } catch (error) {
    next(error);
  }
}

module.exports = loginUser;
