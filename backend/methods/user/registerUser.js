const bcrypt = require("bcrypt");
const yup = require("yup");
const escapeHtml = require('escape-html')

require("dotenv").config();

//bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash("1234", salt)).then(pass => console.log(pass))

const User = require("../../collections/user");

const { insertToken } = require("../token");
const userCreated = require("../../email/emails/userCreated");

const { trimmedString, emailTrimmed, passwordMatch } = require("../../schema");

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      firstname: trimmedString,
      lastname: trimmedString,
      email: emailTrimmed,
      password: trimmedString,
      passwordre: passwordMatch,
      token: trimmedString,
    });

    await schema.validate(req.body);

    const exist = await User.findOne({ email: escapeHtml(req.body.email) });
    if(exist) return res.code(400).send({ status: "error", message: "This user exists in our database!" });

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const name = escapeHtml(`${req.body.firstname} ${req.body.lastname}`);

    const imageParams = Object.entries({
      name: name.split(" ").join("+"),
      size: 250,
      rounded: true,
    })
      .map((param) => param.join("="))
      .join("&");

    const newUser = {
      name,
      password: hash,
      email: escapeHtml(req.body.email),
      login_method: "email",
      image: `https://eu.ui-avatars.com/api/?${imageParams}`,
      permission: 0,
      createdAt: new Date(),
    };

    const savedUser = await User.insertOne(newUser);

    await insertToken(savedUser.insertedId.toString(), "verify").then((token) => userCreated(newUser.email, token, savedUser.insertedId));

    return res.send({ status: "success", message: "Please verify your e-mail address!" });
  } catch (error) {
    if (error.message.startsWith("E11000")) error.message = "This account already exists!";
    return res.send(error);
  }
};
