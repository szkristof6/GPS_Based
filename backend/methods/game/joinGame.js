const bcrypt = require("bcrypt");

const { joinGameSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");

const { setCookie } = require("../cookie");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function joinGame(req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    await joinGameSchema.validate(req.body);

    const game = await Game.findOne({ id: req.body.id });
    if (!game) return res.code(400).send({ status: "error", message: "This game does not exist!" });
    if (game.status === 0)
      return res.code(400).send({ status: "error", message: "This game is not active at the moment!" });

    const password = await bcrypt.compare(req.body.password, game.password);
    if (!password) return res.code(400).send({ status: "error", message: "The password is incorrect!" });

    res = setCookie("g_id", game._id.toString(), res);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = joinGame;
