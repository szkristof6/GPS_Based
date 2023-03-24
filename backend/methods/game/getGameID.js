const bcrypt = require("bcrypt");

const games = require("../../db/games");
const captcha = require("../captcha");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

async function getGame(req, res) {
  try {
    const notBot = await captcha(req);
    if (!notBot) {
      res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }

    const game = await games.findOne({ _id: req.body.id });
    if (game == null) {
      res.send({
        status: "error",
        message: "This game does not exist!",
      });
    }

    const password = await bcrypt.compare(req.body.password, game.password);
    if (password) {
      res.send({ status: "success", id: game._id });
    } else {
      res.send({
        status: "error",
        message: "The password is incorrect!",
      });
    }
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    res.send(error);
  }
}

module.exports = getGame;
