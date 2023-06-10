const { OAuth2Client } = require("google-auth-library");
const yup = require("yup");

require("dotenv").config();

const User = require("../../collections/user");

const { setJWTCookie } = require("../jwt");

const { trimmedString } = require("../../schema");

module.exports = async function (req, res) {
  if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

  const schema = yup.object().shape({
    credential: trimmedString,
    token: trimmedString,
  });
  await schema.validate(req.body);

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
      await setJWTCookie(existing, res);

      return res.send({ status: "success" });
    }

    const user = new User({
      name: payload.name,
      email: payload.email,
      login_method: "google",
      image: payload.picture,
      permission: 1,
    });

    const savedUser = await user.save();

    const jwt = await setJWTCookie(savedUser, res);

    return res.send({ status: "success", jwt });
  } catch (error) {
    if (error.message.startsWith("E11000")) error.message = "This account already exists!";
    return res.send(error);
  }
};
