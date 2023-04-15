const mongoose = require("mongoose");

const Game = require("../../../db/collections/game");

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      game_id: yup.string().trim().length(24).required(),
      gamemode: yup.string().trim().required(),
      location: yup.object({
        x: yup.number().required(),
        y: yup.number().required(),
      }),
      token: yup.string().trim().required(),
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
