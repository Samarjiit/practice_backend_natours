const nodemailer = require('nodemailer');
//Mailtrap is featured as an add-on for safe and comprehensive email testing. Mailtrap Email Testing is implemented as a dummy SMTP server. It catches all your test emails and displays them in virtual inboxes
const sendEmail = async (options) => {
  //1 create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2 define the email options
  const mailOptions = {
    from: 'samarjit mahi <hello@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3. actully send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
