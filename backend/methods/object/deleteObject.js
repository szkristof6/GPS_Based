const mongoose = require("mongoose");
const yup = require("yup");

const Object = require("../../db/collections/object");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      object_id: yup.string().trim().length(24).required(),
      token: yup.string().trim().required(),
    });

    await schema.validate(req.body);

    const object = await Object.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.object_id) });
    if (!object) return res.code(400).send({ status: "error", message: "This  does not exist!" });

    return res.send(team);
  } catch (error) {
    return res.send(error);
  }
};
