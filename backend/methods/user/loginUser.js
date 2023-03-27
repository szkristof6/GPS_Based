require("dotenv").config();

const { loginSchema } = require("../../schemas/user");
const users = require("../../db/users");
const bcrypt = require("bcrypt");

const captcha = require("../captcha");
const JWT_sign = require("../jwt");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function loginUser(req, res) {
  try {
    const notBot = await captcha(req);

    if (!notBot) {
      res.send({
        status: "error",
        message: "Captcha failed!",
      });

      return;
    }
    await loginSchema.validate(req.body);

    const user = await users.findOne({ email: req.body.email });
    if (user == null) {
      res.send({
        status: "error",
        message: "This account does not exist! Please sign in!",
      });

      return;
    }
    if (user.login_method != "email") {
      res.send({
        status: "error",
        message: "Provider method was used for signin!",
      });

      return;
    }
    const password = await bcrypt.compare(req.body.password, user.password);

    if (password) {
      const token = JWT_sign(user);

      res.send({
        status: "success",
        token,
      });

      return;
    } else {
      res.send({
        status: "error",
        message: "The password is incorrect!",
      });

      return;
    }
  } catch (error) {
    res.send(error);

    return;
  }
}

module.exports = loginUser;
