require("dotenv").config();
const bcrypt = require("bcrypt");

const { loginSchema } = require("../../schemas/user");
const User = require("../../db/collections/user");
const captcha = require("../captcha");
const JWT_sign = require("../jwt");
const setCookie = require("../cookie");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function loginUser(req, res) {
  try {
    const verify = await captcha(req);
    if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
      
    await loginSchema.validate(req.body);

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

    const token = JWT_sign(user, "10m");
    const refresh = JWT_sign(user, "30d");

    res = setCookie("Token", token, res);
    res = setCookie("refreshToken", refresh, res);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = loginUser;
