require("dotenv").config();

const captcha = require("../captcha");
const { forgotSchema } = require("../../schemas/user");
const users = require("../../db/collections/users");
const { insertToken } = require("../token");

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
    if(user.login_method !== "email"){
      return res.send({
        status: "error",
        message: "This account uses provider login! Please contect the used provider!",
      });
    }
    const token = await insertToken(user._id, "reset");

    return res.send({ status: "success", token, user_id: user._id });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = requestResetPassword;
