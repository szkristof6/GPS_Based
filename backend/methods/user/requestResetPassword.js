const crypto = require('crypto');
const bcrypt = require("bcrypt");

require("dotenv").config();

const captcha = require("../captcha");
const { forgotSchema } = require("../../schemas/user");
const users = require("../../db/collections/users");
const tokens = require("../../db/collections/tokens");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function requestResetPassword(req, res) {
  try {
    const notBot = await captcha(req);

    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }
    await forgotSchema.validate(req.body);

    const user = await users.findOne({ email: req.body.email });

    if (user == null) {
      return res.send({
        status: "error",
        message: "This account does not exist! Please sign in!",
      });
    }
    const token = await tokens.findOne({ user_id: user._id });
    if (token) await tokens.remove({ user_id: user._id });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.genSalt(parseInt(process.env.SALT)).then((salt) => bcrypt.hash(resetToken, salt));

    await tokens.insert({
      user_id: user._id,
      token: hash,
      createdAt: Date.now(),
    });

    return res.send({ status: "success", resetToken, user_id: user._id });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = requestResetPassword;
