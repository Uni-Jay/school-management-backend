const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// EMAIL SETUP (Gmail SMTP Example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL, // your Gmail address
    pass: process.env.SMTP_PASSWORD // your Gmail app password
  }
});

async function sendMail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Email error:`, err.message);
  }
}

// SMS MOCK FUNCTION
async function sendSMS(phone, message) {
  try {
    // Integrate real SMS service like Twilio here if needed
    console.log(`SMS to ${phone}: ${message}`);
    // For example, using Twilio SDK:
    // await twilioClient.messages.create({ body: message, from: TWILIO_NUMBER, to: phone });
  } catch (err) {
    console.error(`SMS error:`, err.message);
  }
}

module.exports = { sendMail, sendSMS };
