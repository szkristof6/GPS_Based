const bcrypt = require("bcrypt");
const yup = require("yup");

require("dotenv").config();

const User = require("../../collections/user");

const { setJWTCookie } = require("../jwt");

const { trimmedString, emailTrimmed } = require("../../schema");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

module.exports = async function (req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      email: emailTrimmed,
      password: trimmedString,
      token: trimmedString,
    });
    await schema.validate(req.body);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.code(400).send({ status: "error", message: "This account does not exist! Please sign in!" });
    if (user.login_method !== "email")
      return res.code(400).send({ status: "error", message: "Provider method was used for signin!" });
    if (user.permission === 0)
      return res
        .code(400)
        .send({ status: "error", message: "The account is not verified! Please verify your account!" });

    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) return res.code(400).send({ status: "error", message: "The password is incorrect!" });

    const jwt = await setJWTCookie(user, res);

    return res.send({ status: "success", jwt });
  } catch (error) {
    return res.send(error);
  }
};
