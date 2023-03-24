const users = require("../../db/users");
const JWT_sign = require("../jwt");
const captcha = require("../captcha");

async function facebookLogin(req, res) {
  try {
    if (req.body.status != "connected") {
      res.send({ message: "Not connected!" });
    }

    const notBot = await captcha(req);

    if (!notBot) {
      res.send({
        status: "error",
        message: "Captcha failed!",
      });
    }

    const fields = ["email", "name", "picture"].join(",");
    const access_token = req.body.authResponse.accessToken;
    const url = `https://graph.facebook.com/me?fields=${fields}&access_token=${access_token}`;

    const facebook_response = await fetch(url, {
      method: "get",
    }).then((response) => response.json());

    const existing = await users.findOne({ email: facebook_response.email });
    if (existing) {
      if (existing.login_method != "facebook") {
        res.send({
          status: "error",
          message: "Email method was used for signin!",
        });
      } else {
        const token = JWT_sign(existing);

        res.send({
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
      permission: 0,
    });

    const token = JWT_sign(user);

    res.send({
      status: "success",
      token,
    });
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      // A duplicate hiba így kezdődik
      error.message = "This account already exists!";
    }
    res.send(error);
  }
}

module.exports = facebookLogin;
