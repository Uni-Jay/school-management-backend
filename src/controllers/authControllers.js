const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, OTP } = require('../../models');
const { sendMail, sendSMS } = require('../../utils/communication');
const { generateOTP } = require('../../utils/helper');

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user with parent and teacher profiles included (add other profiles similarly)
  const user = await User.findOne({
    where: { email },
    include: [
      { association: 'parentProfile' },
      { association: 'teacherProfile' },
      // add others if needed:
      { association: 'studentProfile' },
      { association: 'schoolAdminProfile' },
      { association: 'schoolSuperAdminProfile' },
      { association: 'superAdminProfile' },
    ],
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Dynamically build roles array based on existing profiles
  const roles = [];
  if (user.parentProfile) roles.push('parent');
  if (user.teacherProfile) roles.push('teacher');
  // Add others if applicable
  if (user.studentProfile) roles.push('student');
  if (user.schoolAdminProfile) roles.push('school_admin');
  if (user.schoolSuperAdminProfile) roles.push('school_super_admin');
  if (user.superAdminProfile) roles.push('super_admin');

  const token = jwt.sign(
    { id: user.id, email: user.email, school_id: user.school_id, roles },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    roles,
    email: user.email,
    full_name: user.full_name,
    school_id: user.school_id,
  });
};

// FORGOT PASSWORD - send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otpCode = generateOTP(); // e.g. 6-digit number
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await OTP.create({
    user_id: user.id,
    code: otpCode,
    used: false,
    expires_at: expiresAt
  });

  // Send email & SMS
  const message = `Your OTP code is ${otpCode}. It expires in 10 minutes.`;
  await sendMail(user.email, 'Password Reset OTP', message);
  if (user.phone_number) {
    await sendSMS(user.phone_number, message);
  }

  res.json({ message: 'OTP sent to your email and phone.' });
};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otpRecord = await OTP.findOne({
    where: {
      user_id: user.id,
      code,
      used: false
    },
    order: [['createdAt', 'DESC']]
  });

  if (!otpRecord) return res.status(400).json({ message: 'Invalid OTP' });
  if (new Date() > otpRecord.expires_at) return res.status(400).json({ message: 'OTP expired' });

  // Mark OTP as used
  otpRecord.used = true;
  await otpRecord.save();

  res.json({ message: 'OTP verified. Proceed to reset password.' });
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  await user.save();

  res.json({ message: 'Password successfully updated' });
};
