const users = require("../../db/users");

/*
Borzasztó egyszerű funkció, lekérdezi adatbázisból az összes felhasználót és visszaadja a kliensnek
*/

async function loginUser(req, res) {
  try {
    const userList = await users.find();
    res.send(userList);
  } catch (error) {
    res.send(error);
  }
}

module.exports = loginUser;
