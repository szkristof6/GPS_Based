require("dotenv").config();

const captcha = require("../captcha");
const { verifySchema } = require("../../schemas/token");
const User = require("../../db/collections/user");

const { verifyToken, removeToken } = require("../token");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function verifyUser(req, res) {
  try {
    const verify = await captcha(req);
    if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    await verifySchema.validate(req.body);

    const { user_id } = req.body;

    const token = await verifyToken(user_id, "verify", 5);
    if (token.status !== "valid") return res.code(400).send(token);

    await User.updateOne({ _id: user_id }, { $set: { permission: 1 } });
    await removeToken(user_id);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = verifyUser;
