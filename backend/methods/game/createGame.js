const bcrypt = require("bcrypt");

const crypto = require("crypto");

const { gamesSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/


module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

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

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
