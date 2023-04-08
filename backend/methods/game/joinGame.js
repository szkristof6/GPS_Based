const bcrypt = require("bcrypt");

const { joinGameSchema } = require("../../schemas/game");
const Game = require("../../db/collections/game");
const captcha = require("../captcha");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function joinGame(req, res) {
  try {
    captcha(req).then((response) => {
      if (!response) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    });
    await joinGameSchema.validate(req.body);

    const game = await Game.findOne({ id: req.body.id });
    if (!game) return res.code(400).send({ status: "error", message: "This game does not exist!" });
    if (game.status === 0) return res.code(400).send({ status: "error", message: "This game is not active at the moment!" });

    const password = await bcrypt.compare(req.body.password, game.password);
    if (!password) return res.code(400).send({ status: "error", message: "The password is incorrect!" });
    return res.send({ status: "success", id: game._id });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = joinGame;
