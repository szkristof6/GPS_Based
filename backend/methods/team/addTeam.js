const mongoose = require("mongoose");

const Team = require("../../collections/team");

const { trimmedString, objectID } = require("../../schema");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      name: trimmedString,
      game_id: objectID,
      color: trimmedString.length(7),
      token: trimmedString,
    });
    await schema.validate(req.body);

    const team = new Team({
      name: req.body.name,
      game_id: new mongoose.Types.ObjectId(req.body.game_id),
      point: 0,
      color: req.body.color,
    });

    const savedTeam = await team.save();
    return res.send({ status: "success", id: savedTeam._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
