require("dotenv").config();
const mongoose = require("mongoose");

const JwtRefresh = require("../../db/collections/jwt_refresh");
const { clearCookie } = require("../cookie");

/*
Nagyon hasonló a regisztrációhoz, annyi különbséggel, hogy nem beteszünk az adatbázisba, hanem keresünk benne
Ha megtaláltuk a felhasználüt, akkor visszaadjuk a tokent a felhasználónak
*/

async function logoutUser(req, res) {
  try {
    if (!req.verified) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const refreshToken = req.unsignCookie(req.cookies.refreshToken);
    if (!refreshToken.valid) return res.code(400).send({ status: "error", message: "Not allowed!" });

    const exist = await JwtRefresh.findOne({
      user_id: new mongoose.Types.ObjectId(req.user.user_id),
      token: refreshToken.value,
    });
    if (!exist) return res.code(400).send({ status: "error", message: "Not logged in!" });

    await JwtRefresh.deleteOne({ user_id: new mongoose.Types.ObjectId(req.user.user_id) });

    const cookies = Object.keys(req.cookies);
    cookies.forEach((cookie) => (res = clearCookie(cookie, res)));

    return res.send({ status: "success" });
  } catch (error) {
    return res.send(error);
  }
}

module.exports = logoutUser;