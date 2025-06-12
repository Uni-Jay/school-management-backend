const { User, Teacher, Subject, Lesson } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Create Teacher and linked User
exports.createTeacher = async (req, res) => {
  try {
    const {
      full_name, email, password, school_id,
      phone, address, img, blood_type, gender, birthday
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name, email, password: hashedPassword,
      role: 'teacher', school_id
    });

    const teacher = await Teacher.create({
      user_id: user.id,
      phone, address, img, blood_type, gender, school_id, birthday
    });

    res.status(201).json({ message: 'Teacher created', teacher });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get teacher by user ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await Teacher.findOne({
      where: { user_id: id },
      include: [{ model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] }],
    });

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.json(teacher);
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{ model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] }],
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update teacher and user
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name, email, password, phone, address, img,
      blood_type, gender, birthday
    } = req.body;

    const teacher = await Teacher.findOne({ where: { user_id: id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.update({ phone, address, img, blood_type, gender, birthday });

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

    res.json({ message: 'Teacher updated', teacher, user });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Soft delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = null;
    await user.save();

    res.json({ message: 'Teacher deactivated' });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teachers by school ID
exports.getTeacherBySchoolId = async (req, res) => {
  try {
    const { school_id } = req.params;

    const teachers = await Teacher.findAll({
      where: { school_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'role', 'school_id'],
      }],
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get teachers by school ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teachers by school ID and search term (partial match on name or email)
exports.getTeacherBySchoolIDandSearch = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { q } = req.query;

    if (!q) return res.status(400).json({ message: 'Search query (q) is required' });

    const teachers = await Teacher.findAll({
      where: { school_id },
      include: [{
        model: User,
        as: 'user',
        attributes: ['full_name', 'email', 'role', 'school_id'],
        where: {
          [Op.or]: [
            { full_name: { [Op.like]: `%${q}%` } },
            { email: { [Op.like]: `%${q}%` } },
          ],
        },
      }],
    });

    res.json(teachers);
  } catch (error) {
    console.error('Search teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teachers by school ID and subject ID
exports.getTeacherBySchoolIDandSubjectID = async (req, res) => {
  try {
    const { school_id, subject_id } = req.params;

    const teachers = await Teacher.findAll({
      where: { school_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['full_name', 'email', 'role', 'school_id'],
        },
        {
          model: Subject,
          as: 'subjects',
          where: { id: subject_id },
          attributes: ['id', 'name', 'code'],
          through: { attributes: [] },
        },
      ],
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get teachers by subject ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teacher by lesson ID
exports.getTeacherByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;

    const lesson = await Lesson.findOne({
      where: { id: lesson_id },
      include: [{
        model: Teacher,
        as: 'teacher',
        include: [{
          model: User,
          as: 'user',
          attributes: ['full_name', 'email', 'role', 'school_id']
        }],
      }],
    });

    if (!lesson || !lesson.teacher) {
      return res.status(404).json({ message: 'Teacher not found for this lesson' });
    }

    res.json(lesson.teacher);
  } catch (error) {
    console.error('Get teacher by lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
