require("dotenv").config();

module.exports = async function captchaMiddleware(request, reply) {
  try {
    if (!request.body.token) request.captchaVerify = false;

    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${request.body.token}`;

    const response = await fetch(url).then((response) => response.json());

    // console.log(`${req.protocol}://${req.hostname}`);

    if (!response.success) request.captchaVerify = false;
    else request.captchaVerify = true;
  } catch (error) {
    request.captchaVerify = false;
  }
};
