const bcrypt = require("bcrypt");

const crypto = require("crypto");

const { gamesSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");
const captcha = require("../captcha");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

async function createGame(req, res) {
  try {
    const verify = await captcha(req);
    if (verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    await gamesSchema.validate(req.body);

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const game = new Game({
      id: crypto.randomBytes(8).toString("hex").slice(0, 15),
      name: req.body.name,
      password: hash,
      gamemode: "test",
      location: req.body.location,
      date: req.body.date,
      status: 0,
    });

    await game.save();

    return res.send({status: "success"});
  } catch (error) {
    return res.send(error);
  }
}

module.exports = createGame;
