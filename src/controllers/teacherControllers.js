const { User, Teacher, Subject, Lesson, School } = require('../../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { sendWelcomeNotification } = require('../../utils/notificationsHelper');

function generatePassword(full_name, birthday) {
  const birthYear = birthday ? birthday.split('-')[0] : '1234';
  const firstName = full_name?.split(' ')[0] || 'user';
  const special = '@';
  return `${firstName}${birthYear}${special}`;
}

// ✅ Create Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { full_name, email, school_id, phone, address, blood_type, gender, birthday, img } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const plainPassword = generatePassword(full_name, birthday);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      full_name, email, password: hashedPassword,
      role: 'teacher', school_id
    });

    const teacher = await Teacher.create({
      user_id: user.id,
      phone, address, img, blood_type, gender, school_id, birthday
    });

    await sendWelcomeNotification({
      school_id, full_name, email, phone, plainPassword
    });

    res.status(201).json({ message: 'Teacher created', teacher });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role', 'school_id'] },
        { model: School, as: 'school', attributes: ['id', 'name'] },
        { model: Subject, as: 'subjects', attributes: ['id', 'name'], through: { attributes: [] } }
      ],
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({
      where: { user_id: id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role', 'school_id'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    res.json(teacher);
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, phone, address, blood_type, gender, birthday, img } = req.body;

    const teacher = await Teacher.findOne({ where: { user_id: id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.update({
      phone, address, blood_type, gender, birthday, img
    });

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

    res.json({ message: 'Teacher updated' });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Delete Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findOne({ where: { user_id: id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    await teacher.destroy();
    await User.destroy({ where: { id } });

    res.json({ message: 'Teacher deleted successfully' });
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
      include: [
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get teachers by school ID error:', error);
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
          model: Subject,
          as: 'subjects',
          where: { id: subject_id },
          attributes: ['id', 'name'],
          through: { attributes: [] }
        },
        { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ]
    });

    res.json(teachers);
  } catch (error) {
    console.error('Get teachers by subject error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get teacher by lesson ID
exports.getTeacherByLesson = async (req, res) => {
  try {
    const { lesson_id } = req.params;

    const lesson = await Lesson.findByPk(lesson_id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
          include: [
            { model: User, as: 'user', attributes: ['id', 'full_name', 'email', 'role'] },
            { model: School, as: 'school', attributes: ['id', 'name'] }
          ]
        }
      ]
    });

    if (!lesson || !lesson.teacher) return res.status(404).json({ message: 'Teacher not found for this lesson' });

    res.json(lesson.teacher);
  } catch (error) {
    console.error('Get teacher by lesson error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Search teachers by full_name or email
exports.getTeacherByFullNameOrEmail = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query parameter is required' });

    const teachers = await Teacher.findAll({
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'full_name', 'email', 'role'],
          required: true  // 👈 This is very important for filtering on nested fields
        },
        { model: School, as: 'school', attributes: ['id', 'name'] }
      ],
      where: {
        [Op.or]: [
          { '$user.full_name$': { [Op.like]: `%${query}%` } },
          { '$user.email$': { [Op.like]: `%${query}%` } }
        ]
      }
    });

    res.json(teachers);
  } catch (error) {
    console.error('Search teachers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
