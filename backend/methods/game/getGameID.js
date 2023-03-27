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

      return;
    }

    const game = await games.findOne({ id: req.body.id });
    if (game === null) {
      res.send({
        status: "error",
        message: "This game does not exist!",
      });

      return;
    }
    if (!game.joinable) {
      res.send({
        status: "error",
        message: "This game is not active at the moment!",
      });

      return;
    }
    const password = await bcrypt.compare(req.body.password, game.password);
    if (password) {
      res.send({ status: "success", id: game._id });

      return;
    } else {
      res.send({
        status: "error",
        message: "The password is incorrect!",
      });

      return;
    }
  } catch (error) {
    if (error.message.startsWith("Argument")) {
      error.message = "The requested game does not exist!";
    }
    res.send(error);

    return;
  }
}

module.exports = getGame;
