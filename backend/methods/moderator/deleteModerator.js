const yup = require("yup");

const Moderator = require("../../collections/moderator");

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
      moderator_id: objectID,
      token: trimmedString,
    });

    await schema.validate(req.body);

    await Moderator.deleteOne({ _id: req.body.moderator_id });

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
