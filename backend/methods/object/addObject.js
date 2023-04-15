const mongoose = require("mongoose");
const yup = require("yup");

const Object = require("../../db/collections/object");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      type: yup.string().trim().required(),
      location: yup.object({
        x: yup.number().required(),
        y: yup.number().required(),
      }),
      radius: yup.number().required(),
      game_id: yup.string().trim().length(24).required(),
    });

    await schema.validate(req.body);

    const object = new Object({
      type: req.user.type,
      location: req.body.location,
      radius: req.body.radius,
      game_id: new mongoose.Types.ObjectId(req.body.game_id),
    });

    const savedObject = await object.save();
    return res.send({ status: "success", id: savedObject._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
