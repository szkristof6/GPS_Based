const bcrypt = require("bcrypt");
require("dotenv").config();

const { registerSchema } = require("../../schemas/user");
const users = require("../../db/users");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function registerUser(req, res) {
  try {
    const notBot = await captcha(req);

    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }

    await registerSchema.validate(req.body); // A kliens felöl érkező adatokat ellenőrizzük egy schema alapján

    if (req.body.password !== req.body.passwordre) {
      return res.send({
        status: "error",
        message: "The passwords are not matching!",
      });
    }

    const saltRounds = 5;
    const hash = await bcrypt.genSalt(saltRounds).then((salt) => bcrypt.hash(req.body.password, salt));

    /*
    Sikeres ellenörzés után betesszük az adatbázisba a felhasználót
    Megadunk egy teszt képet és egy hozzáférési szintet
    */
    const name = `${req.body.firstname} ${req.body.lastname}`;

    const user = await users.insert({
      name,
      password: hash,
      email: req.body.email,
      date: req.body.date,
      login_method: "email",
      image: `https://eu.ui-avatars.com/api/?name=${name}&size=250`,
      permission: 0,
      createdAt: Date.now(),
    });

    return res.send({
      status: "success",
    });
  } catch (error) {
    // Minden hiba esetén ide kerülünk, ahol kezeljük a hibát, vagy továbbküldjük a hibakezelőnek
    if (error.message.startsWith("E11000")) {
      // A duplicate hiba így kezdődik
      error.message = "This account already exists!";
    }
    return res.send(error);
  }
}

module.exports = registerUser;
