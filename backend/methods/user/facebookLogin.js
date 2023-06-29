const yup = require("yup");

const User = require("../../collections/user");

const { setJWTCookie } = require("../jwt");
const { trimmedString } = require("../../schema");

module.exports = async function (req, res) {
  try {
    if (req.body.status != "connected") return res.code(400).send({ message: "Not connected!" });
    if (!req.captchaVerify) return res.code(400).send({ status: "error", message: "Captcha failed!" });

    const schema = yup.object().shape({
      accessToken: trimmedString,
      status: trimmedString,
      token: trimmedString,
    });

    await schema.validate(req.body);

    const fields = ["email", "name", "picture"].join(",");
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${req.body.accessToken}`;

    const facebook_response = fetch(url).then((response) => response.json());

    const existing = await User.findOne({ email: facebook_response.email });
    if (existing) {
      if (existing.login_method != "facebook")
        return res.code(400).send({ status: "error", message: "Email method was used for signin!" });

      const jwt = await setJWTCookie(existing, res);

		const next = existing.permission > 5 ? "admin" : "join";

      return res.send({ status: "success", access_token: jwt, next });
    }

    const newUser = {
      name: facebook_response.name,
      email: facebook_response.email,
      login_method: "facebook",
      image: facebook_response.picture.data.url,
      permission: 1,
      createdAt: new Date(),
    };

    const savedUser = await User.insertOne(newUser);

    const jwt = await setJWTCookie(savedUser, res);

		const next = savedUser.permission > 5 ? "admin" : "join";

    return res.send({ status: "success", access_token: jwt, next });

  } catch (error) {
    if (error.message.startsWith("E11000")) error.message = "This account already exists!";
    return res.send(error);
  }
};
