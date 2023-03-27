const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const users = require("../../db/users");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function googleLogin(req, res) {
  const notBot = await captcha(req);

  if (!notBot) {
    res.send({
      status: "error",
      message: "Captcha failed!",
    });

    return;
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const existing = await users.findOne({ email: payload.email });
    if (existing) {
      if (existing.login_method != "google") {
        res.send({
          status: "error",
          message: "Email method was used for signin!",
        });

        return;
      } else {
        const token = JWT_sign(existing);

        res.send({
          status: "success",
          token,
        });

        return;
      }
    }

    const user = await users.insert({
      name: payload.name,
      email: payload.email,
      login_method: "google",
      image: payload.picture,
      permission: 0,
    });

    const token = JWT_sign(user);

    res.send({
      status: "success",
      token,
    });

    return;
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      // A duplicate hiba így kezdődik
      error.message = "This account already exists!";
    }
    res.send(error);

    return;
  }
}

module.exports = googleLogin;
