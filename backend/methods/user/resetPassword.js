const bcrypt = require("bcrypt");
const yup = require("yup");

require("dotenv").config();

const User = require("../../collections/user");

const { verifyToken, removeToken } = require("../token");

const { trimmedString, emailTrimmed, objectID, passwordMatch } = require("../../schema");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

module.exports = async function resetPassword(req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      user_id: objectID,
      user_token: trimmedString,
      token: trimmedString,
      email: emailTrimmed,
      password: trimmedString,
      passwordre: passwordMatch,
    });
    await schema.validate(req.body);

    const { user_id } = req.body;

    const passwordResetToken = await verifyToken(user_id, "reset", 5);
    if (passwordResetToken.status !== "valid") return res.code(400).send(passwordResetToken);

    const password = await bcrypt.compare(req.body.user_token, passwordResetToken.token);
    if (!password) return res.code(400).send({ status: "error", message: "Invalid or expired password reset token!" });

    const user = await User.findOne({ _id: user_id }, { projection: { email: 1 } });
    if (req.body.email !== user.email)
      return res.code(400).send({ status: "error", message: "Account with the given email does not exist!" });

    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(req.body.password, salt));
    await User.updateOne({ _id: user_id }, { $set: { password: hash } });

    await removeToken(user_id);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
