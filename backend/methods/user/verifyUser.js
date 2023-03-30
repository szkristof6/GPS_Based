require("dotenv").config();

const captcha = require("../captcha");
const { verifySchema } = require("../../schemas/user");
const users = require("../../db/collections/users");

const { verifyToken, removeToken } = require("../token");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function verifyUser(req, res) {
  try {
    const notBot = await captcha(req);

    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }
    await verifySchema.validate(req.body);

    const verify = await verifyToken(req.body.user_id, "verify", 5);
    if (verify.status !== "valid") {
      return res.send(verify);
    }

    const updated = await users.findOneAndUpdate({ _id: req.body.user_id }, { $set: { permission: 1 } });

    await removeToken(req.body.user_id);

    return res.send({ status: "success", updated });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = verifyUser;
