const transporter = require("../nodemailer");

async function userCreated(req, res) {
  try {
    // send mail with defined transport object
    const email = await transporter.sendMail({
      from: "GPSBased Info <gps.based.info@gmail.com>", // sender address
      to: "szabokristof6@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    return res.send({ email });
  } catch (error) {
    return res.send({ error });
  }
}

module.exports = userCreated;
