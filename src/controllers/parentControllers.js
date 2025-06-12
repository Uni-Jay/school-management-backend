const { User, Parent, School, OTP } = require('../models');
const bcrypt = require('bcryptjs');
const { sendMail, sendSMS } = require('../utils/communication');
const crypto = require('crypto');

const allowedRoles = ['super_admin', 'school_super_admin', 'school_admin'];

// Helper: generate OTP
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  // 🎉 Create Parent
  createParent: async (req, res) => {
    try {
      const { full_name, email, phone, address, img, blood_type, birthday, gender, school_id } = req.body;

      if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);

      if (!full_name || !email || !phone || !school_id) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ error: 'Email already in use' });

      const birthYear = new Date(birthday).getFullYear();
      const plainPassword = `${full_name.split(' ')[0].toLowerCase()}${birthYear}@`;
      const passwordHash = await bcrypt.hash(plainPassword, 10);

      const user = await User.create({
        full_name, email, password: passwordHash,
        role: 'parent', school_id
      });

      const parent = await Parent.create({
        user_id: user.id, phone, address, img,
        blood_type, birthday, gender, school_id
      });

      const school = await School.findByPk(school_id);
      const school_name = school?.name || 'the school';
      const changeLink = `https://yourapp.com/reset-password?email=${encodeURIComponent(email)}`;
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

      res.status(201).json({ user, parent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed creating parent' });
    }
  },

  // 👁️ List/Search Parents
  listParents: async (req, res) => {
    try {
      const school_id = req.user.role === 'super_admin' ? null : req.user.school_id;
      const { search } = req.query;
      const where = school_id ? { school_id } : {};

      if (search) {
        where[Op.or] = [
          { '$user.full_name$': { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } }
        ];
      }

      const parents = await Parent.findAll({
        where,
        include: [{ model: User, as: 'user', attributes: ['email', 'full_name'] }]
      });

      res.json(parents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed listing parents' });
    }
  },

  // 🛠️ Update Parent
  updateParent: async (req, res) => {
    try {
      if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);

      const parent = await Parent.findByPk(req.params.id);
      if (!parent) return res.sendStatus(404);

      if (req.user.role !== 'super_admin' && parent.school_id !== req.user.school_id) {
        return res.sendStatus(403);
      }

      await parent.update(req.body);
      res.json(parent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed updating parent' });
    }
  },

  // 🗑️ Delete Parent
  deleteParent: async (req, res) => {
    try {
      if (!allowedRoles.includes(req.user.role)) return res.sendStatus(403);

      const parent = await Parent.findByPk(req.params.id);
      if (!parent) return res.sendStatus(404);

      if (req.user.role !== 'super_admin' && parent.school_id !== req.user.school_id) {
        return res.sendStatus(403);
      }

      const user = await User.findByPk(parent.user_id);
      await parent.destroy();
      await user.destroy();

      res.json({ message: 'Deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed deleting parent' });
    }
  },
}
