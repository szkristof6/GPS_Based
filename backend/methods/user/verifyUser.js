const yup = require("yup");
const { ObjectId } = require("mongodb");

require("dotenv").config();

const User = require("../../collections/user");

const { verifyToken, removeToken } = require("../token");

const { trimmedString, objectID } = require("../../schema");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

module.exports = async function verifyUser(req, res) {
  try {
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      user_token: trimmedString,
      user_id: objectID,
      token: trimmedString,
    });
    await schema.validate(req.body);

    const { user_id } = req.body;

    const token = await verifyToken(user_id, "verify", 5);
    if (token.status !== "valid") return res.code(400).send(token);

    await User.updateOne({ _id: new ObjectId(user_id) }, { $set: { permission: 1 } });
    await removeToken(user_id);

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
};
