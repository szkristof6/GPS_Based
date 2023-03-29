require("dotenv").config();

async function captcha(req) {
  const secret_key = process.env.CAPTCHA_SECRET;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${req.body.token}`;

  try {
    const google_response = await fetch(url, {
      method: "get",
    }).then((response) => response.json());

    console.log(google_response);

    // console.log(`${req.protocol}://${req.hostname}`);
    
    if(google_response.success){
      return true;
    } else {
      return false;
    }
  } catch (error) {
    res.send(error);
  }
}

module.exports = captcha;
