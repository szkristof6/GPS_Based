const { facebookSchema } = require("../../schemas/user");
const users = require("../../db/collections/users");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function facebookLogin(req, res) {
  try {
    if (req.body.status != "connected") {
      return res.send({ message: "Not connected!" });
    }

    const notBot = await captcha(req);
    if (!notBot) {
      return res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }

    await facebookSchema.validate(req.body);

    const fields = ["email", "name", "picture"].join(",");
    const accessToken = req.body.accessToken;
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${accessToken}`;

    const facebook_response = await fetch(url, {
      method: "get",
    }).then((response) => response.json());

    const existing = await users.findOne({ email: facebook_response.email });
    if (existing) {
      if (existing.login_method != "facebook") {
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
      name: facebook_response.name,
      email: facebook_response.email,
      login_method: "facebook",
      image: facebook_response.picture.data.url,
      permission: 1,
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

module.exports = facebookLogin;
