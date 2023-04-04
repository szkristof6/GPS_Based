const bcrypt = require("bcrypt");

require("dotenv").config();

const captcha = require("../captcha");
const { resetSchema } = require("../../schemas/user");
const users = require("../../db/collections/users");

const { verifyToken, removeToken } = require("../token");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function resetPassword(req, res) {
  try {
    const notBot = await captcha(req);

    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }
    await resetSchema.validate(req.body);

    const passwordResetToken = await verifyToken(req.body.user_id, "reset", 5);
    if (passwordResetToken.status !== "valid") {
      return res.send(passwordResetToken);
    }


    const isValid = await bcrypt.compare(req.body.user_token, passwordResetToken.token);
    if (isValid === null) {
      return res.send({
        status: "error",
        message: "Invalid or expired password reset token!",
      });
    }

    if (req.body.password !== req.body.passwordre) {
      return res.send({
        status: "error",
        message: "The passwords are not matching!",
      });
    }

    const user = await users.findOne({ _id: req.body.user_id });
    if (req.body.email !== user.email) {
      return res.send({
        status: "error",
        message: "Account with the given email does not exist!",
      });
    }

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));
    const updated = await users.findOneAndUpdate({ _id: req.body.user_id }, { $set: { password: hash } });

    await removeToken(req.body.user_id);

    return res.send({ status: "success", updated });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = resetPassword;
