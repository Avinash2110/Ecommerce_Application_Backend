const nodemailer = require("nodemailer");

const mailHelper = async (options) =>{

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
      },
    });

    const message = {
        from: process.env.SENDER_EMAIL, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.text, // plain text body
    }

    // send mail with defined transport object
    let info = await transporter.sendMail(message);
    return info;
}

module.exports = mailHelper;