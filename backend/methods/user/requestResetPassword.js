require("dotenv").config();

const captcha = require("../captcha");
const { forgotSchema } = require("../../schemas/token");
const User = require("../../db/collections/user");
const { insertToken } = require("../token");
const passwordReset = require("../../email/emails/passwordReset");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function requestResetPassword(req, res) {
  try {
    const verify = await captcha(req);
    if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    await forgotSchema.validate(req.body);

    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.code(400).send({ status: "error", message: "This account does not exist! Please sign in!" });
    if (user.login_method !== "email")
      return res.code(400).send({
        status: "error",
        message: "This account uses provider login! Please contect the used provider!",
      });

    insertToken(user._id, "reset").then((token) => passwordReset(user.email, token, user._id));

    return res.send({ status: "success", message: "The e-mail has been sent!" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = requestResetPassword;
