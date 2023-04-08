const bcrypt = require("bcrypt");

require("dotenv").config();

const captcha = require("../captcha");
const { resetSchema } = require("../../schemas/token");
const User = require("../../db/collections/user");

const { verifyToken, removeToken } = require("../token");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function resetPassword(req, res) {
  try {
    const verify = await captcha(req);
    if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    await resetSchema.validate(req.body);

    const { user_id } = req.body;

    const passwordResetToken = await verifyToken(user_id, "reset", 5);
    if (passwordResetToken.status !== "valid") return res.code(400).send(passwordResetToken);

    const password = await bcrypt.compare(req.body.user_token, passwordResetToken.token);
    if (!password)
      return res.code(400).send({ status: "error", message: "Invalid or expired password reset token!" });

    const user = await User.findOne({ _id: user_id });
    if (req.body.email !== user.email)
      return res.code(400).send({ status: "error", message: "Account with the given email does not exist!" });

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));
    await User.updateOne({ _id: user_id}, { $set: { password: hash } });

    await removeToken(user_id);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = resetPassword;
