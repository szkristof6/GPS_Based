const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const { googleSchema } = require("../../schemas/user");
const users = require("../../db/users");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function googleLogin(req, res) {
  const notBot = await captcha(req);

  if (!notBot) {
    return res.send({
      status: "error",
      message: "Captcha failed!",
    });
  }

  await googleSchema.validate(req.body);

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
        return res.send({
          status: "error",
          message: "Email method was used for signin!",
        });
      } else {
        const token = JWT_sign(existing);

        return res.send({
          status: "success",
          token,
        });
      }
    }

    const user = await users.insert({
      name: payload.name,
      email: payload.email,
      login_method: "google",
      image: payload.picture,
      permission: 0,
      createdAt: Date.now(),
    });

    const token = JWT_sign(user);

    return res.send({
      status: "success",
      token,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      // A duplicate hiba így kezdődik
      error.message = "This account already exists!";
    }
    return res.send(error);
  }
}

module.exports = googleLogin;
