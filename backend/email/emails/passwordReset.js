const { sendMail } = require("../nodemailer");

module.exports = async function (email, token, user_id) {
  try {
    const html = `
    <p>
    You have requested a password reset!

    In case the person requested the new password consider this email as nothing.
    Otherwise click on this link to continue: https://map.stagenex.hu/reset?token=${token}&user_id=${user_id}
    </p>
    `;

    // send mail with defined transport object
    const response = await sendMail(email, "Password reset", "", html);

    return response;
  } catch (error) {
    return error;
  }
};
