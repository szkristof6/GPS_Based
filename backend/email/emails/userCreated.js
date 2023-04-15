const { sendMail } = require("../nodemailer");

module.exports = async function (email, token, user_id) {
  try {
    const html = `
    <p>
    Thank you for signing up for our app! We hope you will enjoy your time with us!

    First of all, please verify your account!
    Click on this link to continue: https://map.stagenex.hu/verify?token=${token}&user_id=${user_id}
    </p>
    `;

    // send mail with defined transport object
    const response = await sendMail(email, "Thank you for singing up", "", html);

    return response;
  } catch (error) {
    return error;
  }
};
