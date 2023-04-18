const mongoose = require("mongoose");
const yup = require("yup");
const escapeHtml = require('escape-html')

const Object = require("../../collections/object");

const { trimmedString, objectID, numberMin, locationObject } = require("../../schema");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      type: trimmedString,
      location: locationObject,
      radius: numberMin,
      game_id: objectID,
      token: trimmedString,
    });

    await schema.validate(req.body);

    const object = new Object({
      type: escapeHtml(req.user.type),
      location: req.body.location,
      radius: escapeHtml(req.body.radius),
      game_id: new mongoose.Types.ObjectId(req.body.game_id),
    });

    const savedObject = await object.save();
    return res.send({ status: "success", id: savedObject._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
