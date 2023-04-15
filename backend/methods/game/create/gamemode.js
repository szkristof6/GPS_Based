const mongoose = require("mongoose");
const yup = require("yup");

const Game = require("../../../collections/game");

const { objectID, trimmedString, locationObject } = require("../../../schema");

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      game_id: objectID,
      gamemode: trimmedString,
      location: locationObject,
      token: trimmedString,
    });

    await schema.validate(req.body);

    await Game.updateOne(
      { _id: new mongoose.Types.ObjectId(req.body.game_id) },
      { $set: { gamemode: req.body.gamemode, location: req.body.location } }
    );

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
