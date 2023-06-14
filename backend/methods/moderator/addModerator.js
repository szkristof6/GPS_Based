const yup = require("yup");

const Moderator = require("../../collections/moderator");

const { trimmedString, numberMin, objectID } = require("../../schema");

/*
Megnézzük, hogy a kliensről érkező adatok megfelelőek-e,
Ha igen, akkor betesszük adatbázisba a játékot és visszatérünk..
*/

module.exports = async function (req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      game_id: objectID,
      permission: numberMin,
      token: trimmedString,
    });

    await schema.validate(req.body);

    const newModerator = {
      user_id: req.user.user_id,
      game_id: req.body.game_id,
      permission: req.body.permission,
    };

		const savedModerator = await Moderator.insertOne(newModerator);

    return res.send({ status: "success", id: savedModerator._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
