const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "s32.tarhely.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "info@bandklive.hu", // generated ethereal user
    pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  },
});

async function sendMail(to, subject, text, html) {
  try {
    const email = await transporter.sendMail({
      from: "GPSBased no-reply <info@bandklive.hu>", // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    return email;
  } catch (error) {
    return error;
  }
}

module.exports = {transporter, sendMail};
