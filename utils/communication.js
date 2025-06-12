const nodemailer = require('nodemailer');
dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: `"Your App Name" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendMail };
