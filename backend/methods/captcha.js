require("dotenv").config();

async function captcha(req) {
  try {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${req.body.token}`;
    
    const response = await fetch(url).then((response) => response.json());

    // console.log(`${req.protocol}://${req.hostname}`);

    return response.success;
  } catch (error) {
    return error;
  }
}

module.exports = captcha;
