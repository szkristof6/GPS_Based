const bcrypt = require("bcrypt");
const crypto = require("crypto");
const yup = require("yup");

const Game = require("../../../collections/game");

const { trimmedString, dateTime } = require("../../../schema");

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const schema = yup.object().shape({
      name: trimmedString.max(255),
      desc: trimmedString.max(500),
      password: trimmedString,
      date: dateTime,
      token: trimmedString,
    });

    await schema.validate(req.body);

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const game = new Game({
      id: crypto.randomBytes(8).toString("hex"),
      name: req.body.name,
      desc: req.body.desc,
      date: req.body.date,
      password: hash,
      status: 0,
    });

    const savedGame = await game.save();

    return res.send({ status: "success", id: savedGame._id.toString() });
  } catch (error) {
    return res.send(error);
  }
};
