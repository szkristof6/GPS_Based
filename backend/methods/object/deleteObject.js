const mongoose = require("mongoose");
const yup = require("yup");

const Object = require("../../collections/object");

const { trimmedString, objectID } = require("../../schema");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      object_id: objectID,
      token: trimmedString,
    });

    await schema.validate(req.body);

    await Object.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.object_id) });

    return res.send(team);
  } catch (error) {
    return res.send(error);
  }
};
