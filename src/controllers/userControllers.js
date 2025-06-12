const { User, School, Student, Teacher, Parent, SchoolAdmin, SchoolSuperAdmin, SuperAdmin } = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Create user
exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password, role, school_id } = req.body;

    const hashedPassword = await bcrypt.hash(password || 'defaultPass123', 10);

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      role,
      school_id,
      isActive: true
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: ['school']
    });
    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        'school',
        'studentProfile',
        'teacherProfile',
        'parentProfile',
        'schoolAdminProfile',
        'schoolSuperAdminProfile',
        'superAdminProfile'
      ]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Get User by ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by school ID
exports.getUsersBySchoolId = async (req, res) => {
  try {
    const { school_id } = req.params;

    const users = await User.findAll({
      where: { school_id },
      include: ['school']
    });

    res.json(users);
  } catch (error) {
    console.error('Get Users by School ID Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by role
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    const users = await User.findAll({
      where: { role },
      include: ['school']
    });

    res.json(users);
  } catch (error) {
    console.error('Get Users by Role Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get users by role & school ID
exports.getUsersBySchoolAndRole = async (req, res) => {
  try {
    const { role, school_id } = req.query;

    const users = await User.findAll({
      where: { role, school_id },
      include: ['school']
    });

    res.json(users);
  } catch (error) {
    console.error('Get Users by School and Role Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Search Users Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, role, school_id } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ full_name, email, role, school_id });

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete
exports.deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: false });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Deactivate User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reactivate
exports.reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update({ isActive: true });

    res.json({ message: 'User reactivated successfully' });
  } catch (error) {
    console.error('Reactivate User Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
