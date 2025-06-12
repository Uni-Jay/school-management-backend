const { User, Parent, Student } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { sendWelcomeNotification } = require('../../utils/notificationsHelper');

// Utility: Generate default password
function generatePassword(full_name, birthday) {
  const birthYear = birthday ? birthday.split('-')[0] : '1234';
  const firstName = full_name?.split(' ')[0] || 'user';
  const special = '@';
  return `${firstName}${birthYear}${special}`;
}

// CREATE PARENT
exports.createParent = async (req, res) => {
  try {
    const {
      full_name, email, phone, address, blood_type,
      birthday, gender, school_id
    } = req.body;

    const img = req.file ? req.file.filename : null;

    let user = await User.findOne({ where: { email } });

    if (user) {
      const existingParent = await Parent.findOne({ where: { user_id: user.id } });
      if (existingParent) {
        return res.status(400).json({ error: 'Parent profile already exists for this user' });
      }

      const parent = await Parent.create({
        user_id: user.id, phone, address, img, blood_type, birthday, gender, school_id
      });

      return res.status(201).json({ message: 'Parent profile added to existing user', parent });
    } else {
      const plainPassword = generatePassword(full_name, birthday);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      user = await User.create({
        full_name,
        email,
        phone,
        password: hashedPassword,
        role: 'parent',
        school_id,
      });

      const parent = await Parent.create({
        user_id: user.id,
        phone, address, img, blood_type, birthday, gender, school_id
      });

      await sendWelcomeNotification({ school_id, full_name, email, phone, plainPassword });

      return res.status(201).json({ message: 'Parent created and notified', user, parent });
    }
  } catch (error) {
    console.error('Create parent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET PARENT BY ID
exports.getParentById = async (req, res) => {
  try {
    const { id } = req.params;

    const parent = await Parent.findOne({
      where: { user_id: id },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] },
        { model: Student, as: 'students' }
      ],
    });

    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    res.json(parent);
  } catch (error) {
    console.error('Get parent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL PARENTS
exports.getAllParents = async (req, res) => {
  try {
    const parents = await Parent.findAll({
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] },
        { model: Student, as: 'students' }
      ],
    });

    res.json(parents);
  } catch (error) {
    console.error('Get all parents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE PARENT
exports.updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name, email, password, phone, address,
      blood_type, gender, birthday
    } = req.body;

    const img = req.file ? req.file.filename : null;

    const parent = await Parent.findOne({ where: { user_id: id } });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    await parent.update({ phone, address, img, blood_type, gender, birthday });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    if (full_name) user.full_name = full_name;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: 'Parent updated', parent, user });
  } catch (error) {
    console.error('Update parent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE (DEACTIVATE) PARENT
exports.deleteParent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = null; // Soft delete
    await user.save();

    res.json({ message: 'Parent deactivated' });
  } catch (error) {
    console.error('Delete parent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET PARENTS BY SCHOOL ID
exports.getParentBySchoolID = async (req, res) => {
  try {
    const { school_id } = req.params;

    const parents = await Parent.findAll({
      where: { school_id },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'school_id'] },
        { model: Student, as: 'students' }
      ]
    });

    res.json(parents);
  } catch (error) {
    console.error('Get parents by school error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET PARENTS BY SCHOOL ID AND SEARCH
exports.getParentBySchoolIDandSearch = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { query } = req.query;

    const parents = await Parent.findAll({
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
          attributes: ['full_name', 'email', 'school_id']
        },
        { model: Student, as: 'students' }
      ]
    });

    res.json(parents);
  } catch (error) {
    console.error('Search parents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// GET PARENTS BY STUDENT ID
exports.getParentsByStudentId = async (req, res) => {
  try {
    const { student_id } = req.params;

    const student = await Student.findByPk(student_id, {
      include: [
        {
          model: Parent,
          as: 'parents',
          include: [{ model: User, as: 'user', attributes: ['full_name', 'email'] }]
        }
      ]
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student.parents);
  } catch (error) {
    console.error('Get parents by student ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};