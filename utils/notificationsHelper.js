const { School } = require('../models'); // adjust path to your models
const { sendMail, sendSMS } = require('./communication');

const sendWelcomeNotification = async ({ school_id, full_name, email, phone, plainPassword }) => {
  const school = await School.findByPk(school_id);
  const school_name = school?.name || 'the school';
  const clientAppUrl = process.env.REMOTE_CLIENT_APP || process.env.LOCAL_CLIENT_APP || 'http://localhost:3000';
  const changePasswordLink = `${clientAppUrl}/reset-password?email=${encodeURIComponent(email)}`;

  // const changePasswordLink = `https://yourapp.com/reset-password?email=${encodeURIComponent(email)}`;
  const emailBody = `
    Hello ${full_name},<br/><br/>
    Welcome to <b>${school_name}</b>!<br/>
    Your account has been created successfully in our ${school_name}.<br/><br/>
    <b>Email:</b> ${email}<br/>
    <b>Temporary Password:</b> ${plainPassword}<br/><br/>
    Please <a href="${changePasswordLink}">click here</a> to change your password immediately.<br/><br/>
    Best regards,<br/>
    ${school_name} Team
  `;

  await sendMail(email, `Welcome to ${school_name}`, emailBody);
  await sendSMS(phone, `Welcome ${full_name}! Temp password: ${plainPassword}`);
};

module.exports = { sendWelcomeNotification };
