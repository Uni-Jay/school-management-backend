const { User, SchoolAdmin, School, Teacher } = require('../../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { sendWelcomeNotification } = require('../../utils/notificationsHelper');

// Utility: Generate default password
function generatePassword(full_name, birthday) {
  const birthYear = birthday ? birthday.split('-')[0] : '1234';
  const firstName = full_name?.split(' ')[0] || 'user';
  const special = '@';
  return `${firstName}${birthYear}${special}`;
}

// CREATE
exports.createSchoolAdmin = async (req, res) => {
  try {
    const {
      full_name, email, school_id,
      phone, address, blood_type, gender, birthday, teacher_id
    } = req.body;

    const img = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const plainPassword = generatePassword(full_name, birthday);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role: 'school_admin',
      school_id
    });

    const admin = await SchoolAdmin.create({
      user_id: user.id,
      phone,
      address,
      img,
      blood_type,
      gender,
      birthday,
      school_id,
      teacher_id: teacher_id || null
    });

    await sendWelcomeNotification({
      school_id,
      full_name,
      email,
      phone,
      plainPassword
    });

    res.status(201).json({ message: 'School Admin created successfully', admin });
  } catch (error) {
    console.error('Create SchoolAdmin Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL
exports.getAllSchoolAdmins = async (req, res) => {
  try {
    const admins = await SchoolAdmin.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });
    res.json(admins);
  } catch (error) {
    console.error('Get All Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY ID
exports.getSchoolAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolAdmin.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    if (!admin) return res.status(404).json({ message: 'Not found' });

    res.json(admin);
  } catch (error) {
    console.error('Get By ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE
exports.updateSchoolAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      phone, address, blood_type, gender, birthday, teacher_id
    } = req.body;

    const admin = await SchoolAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const img = req.file ? req.file.filename : admin.img;

    await admin.update({
      phone,
      address,
      blood_type,
      gender,
      birthday,
      teacher_id: teacher_id || null,
      img
    });

    res.json({ message: 'Updated successfully', admin });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE (SOFT DELETE)
exports.softDeleteSchoolAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const user = await User.findByPk(admin.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: false });
    res.json({ message: 'User deactivated' });
  } catch (error) {
    console.error('Soft Delete Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// REACTIVATE
exports.reactivateSchoolAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await SchoolAdmin.findByPk(id);
    if (!admin) return res.status(404).json({ message: 'Not found' });

    const user = await User.findByPk(admin.user_id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: true });
    res.json({ message: 'User reactivated' });
  } catch (error) {
    console.error('Reactivate Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET BY SCHOOL ID
exports.getSchoolAdminsBySchoolID = async (req, res) => {
  try {
    const { school_id } = req.params;

    const admins = await SchoolAdmin.findAll({
      where: { school_id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    res.json(admins);
  } catch (error) {
    console.error('Fetch by school_id error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH BY SCHOOL ID + QUERY
exports.searchSchoolAdminsBySchoolID = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { query } = req.query;

    const admins = await SchoolAdmin.findAll({
      where: { school_id },
      include: [
        {
          model: User,
          as: 'user',
          where: {
            [Op.or]: [
              { full_name: { [Op.like]: `%${query}%` } },
              { email: { [Op.like]: `%${query}%` } }
            ]
          },
          attributes: ['id', 'full_name', 'email', 'role']
        },
        {
          model: School,
          as: 'school',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json(admins);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
