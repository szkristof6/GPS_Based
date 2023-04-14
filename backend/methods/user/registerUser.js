const bcrypt = require("bcrypt");
require("dotenv").config();

const { registerSchema } = require("../../schemas/user");

const User = require("../../db/collections/user");
const { insertToken } = require("../token");
const userCreated = require("../../email/emails/userCreated");

async function registerUser(req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    await registerSchema.validate(req.body);

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));

    const name = `${req.body.firstname} ${req.body.lastname}`;

    const imageParams = Object.entries({
      name: name.split(" ").join("+"),
      size: 250,
      rounded: true,
    })
      .map((param) => param.join("="))
      .join("&");

    const user = new User({
      name,
      password: hash,
      email: req.body.email,
      login_method: "email",
      image: `https://eu.ui-avatars.com/api/?${imageParams}`,
      permission: 0,
    });

    const savedUser = await user.save();

    await insertToken(savedUser._id, "verify").then((token) => userCreated(savedUser.email, token, savedUser._id));

    return res.send({ status: "success", message: "Please verify your e-mail address!" });
  } catch (error) {
    if (error.message.startsWith("E11000")) error.message = "This account already exists!";
    return res.send(error);
  }
}

module.exports = registerUser;
