const { OAuth2Client } = require("google-auth-library");

require("dotenv").config();

const { googleSchema } = require("../../schemas/social");
const User = require("../../db/collections/user");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function googleLogin(req, res) {
  const verify = await captcha(req);
  if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
  await googleSchema.validate(req.body);

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      if (existing.login_method != "google")
        return res.code(400).send({ status: "error", message: "Email method was used for signin!" });
      const token = JWT_sign(existing);

      return res.header("token", token).send({ status: "success", token });
    }

    const user = new User({
      name: payload.name,
      email: payload.email,
      login_method: "google",
      image: payload.picture,
      permission: 1,
    });

    await user.save();

    const token = JWT_sign(user);

    return res.header("token", token).send({ status: "success", token });
  } catch (error) {
    if (error.message.startsWith("E11000")) error.message = "This account already exists!";
    return res.send(error);
  }
}

module.exports = googleLogin;
