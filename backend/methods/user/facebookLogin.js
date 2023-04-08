const { facebookSchema } = require("../../schemas/social");
const User = require("../../db/collections/user");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function facebookLogin(req, res) {
  try {
    if (req.body.status != "connected") return res.code(400).send({ message: "Not connected!" });

    const verify = await captcha(req);
    if (!verify) return res.code(400).send({ status: "error", message: "Captcha failed!" });
    await facebookSchema.validate(req.body);

    const fields = ["email", "name", "picture"].join(",");
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${req.body.accessToken}`;

    const facebook_response = fetch(url).then((response) => response.json());

    const existing = await User.findOne({ email: facebook_response.email });
    if (existing) {
      if (existing.login_method != "facebook")
        return res.code(400).send({ status: "error", message: "Email method was used for signin!" });

      const token = JWT_sign(existing);

      return res.header("token", token).send({ status: "success", token });
    }

    const user = new User({
      name: facebook_response.name,
      email: facebook_response.email,
      login_method: "facebook",
      image: facebook_response.picture.data.url,
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

module.exports = facebookLogin;
