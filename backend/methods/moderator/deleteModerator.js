const mongoose = require("mongoose");
const yup = require("yup");

const Moderator = require("../../db/collections/moderator");

/*
Lekérdezzük az adatbásból azt a játékot, amelyiknek az azonosítója egyezik a megadott azonosítóval
Ha létezik visszaadjuk mindent
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      moderator_id: yup.string().trim().length(24).required(),
      token: yup.string().trim().required(),
    });

    await schema.validate(req.body);

    await Moderator.deleteOne({ _id: new mongoose.Types.ObjectId(req.body.moderator_id) });

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
