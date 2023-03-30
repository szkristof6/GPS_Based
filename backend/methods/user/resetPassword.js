const bcrypt = require("bcrypt");
const monk = require("monk");

require("dotenv").config();

const captcha = require("../captcha");
const { resetSchema } = require("../../schemas/user");
const users = require("../../db/collections/users");
const tokens = require("../../db/collections/tokens");

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

    const passwordResetToken = await tokens.findOne({ user_id: monk.id(req.body.user_id) });
    if (passwordResetToken === null) {
      return res.send({
        status: "error",
        message: "Invalid or expired password reset token!",
      });
    }

    const currentTime = Date.now();
    const delta = currentTime - passwordResetToken.createdAt;

    if (delta >= 5 * 60 * 1000 ) {
        return res.send({
          status: "error",
          message: "Invalid or expired password reset token!",
        });
      }

    const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
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

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));
    const updated = await users.findOneAndUpdate({ _id: req.body.user_id }, { $set: { password: hash } });

    await tokens.remove({ user_id: monk.id(req.body.user_id) });

    return res.send({ status: "success", updated });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = resetPassword;
