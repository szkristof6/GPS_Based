const bcrypt = require("bcrypt");

const { joinGameSchema } = require("../../schemas/game");
const games = require("../../db/games");
const captcha = require("../captcha");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function joinGame(req, res) {
  try {
    const notBot = await captcha(req);
    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }

    await joinGameSchema.validate(req.body);

    const game = await games.findOne({ id: req.body.id });
    if (game === null) {
      return res.send({
        status: "error",
        message: "This game does not exist!",
      });
    }
    if (game.status === 0) {
      return res.send({
        status: "error",
        message: "This game is not active at the moment!",
      });
    }
    const password = await bcrypt.compare(req.body.password, game.password);
    if (password) {
      return res.send({ status: "success", id: game._id });
    } else {
      return res.send({
        status: "error",
        message: "The password is incorrect!",
      });
    }
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    return res.send(error);
  }
}

module.exports = joinGame;
