const { User, Student, Parent, Class, School } = require('../../models');
const bcrypt = require('bcrypt');
const { sendWelcomeNotification } = require('../../utils/notificationsHelper'); // adjust path as needed
const { Op } = require('sequelize');
const StudentSubjects = require('../../models/StudentSubjects'); // adjust path as needed


function generatePassword(full_name, birthday) {
  const birthYear = birthday ? birthday.split('-')[0] : '1234';
  const firstName = full_name?.split(' ')[0] || 'user';
  const special = '@';
  return `${firstName}${birthYear}${special}`;
}

exports.createStudent = async (req, res) => {
    try {
      const {
        full_name, email, password, school_id,
        admission_number, class_id, parent_id,
        phone, address, blood_type, gender, birthday, date_of_birth,
        subject_ids = [], lesson_ids = []
      } = req.body;
      const img = req.file ? req.file.filename : null;
  
      // Validate parent exists
      const parent = await Parent.findByPk(parent_id);
      if (!parent) return res.status(400).json({ message: 'Parent not found' });
  
      // Validate class exists
      const classExists = await Class.findByPk(class_id);
      if (!classExists) return res.status(400).json({ message: 'Class not found' });
  
      // Check email uniqueness
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email already in use' });
  
      // Generate password
    const plainPassword = generatePassword(full_name, birthday);

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
  
      // Create User record
      const user = await User.create({
        full_name,
        email,
        password: hashedPassword,
        role: 'student',
        school_id
      });
  
      // Create Student profile record
      const student = await Student.create({
        user_id: user.id,
        admission_number,
        class_id,
        parent_id,
        phone,
        address,
        img,
        blood_type,
        gender,
        birthday,
        date_of_birth,
        school_id
      });
  
      // Assign subjects (if any)
      if (Array.isArray(subject_ids) && subject_ids.length > 0) {
        const subjectData = subject_ids.map(subject_id => ({
          student_id: student.id,
          subject_id,
          school_id
        }));
        await StudentSubjects.bulkCreate(subjectData);
      }
  
      // Assign lessons (if any)
      if (Array.isArray(lesson_ids) && lesson_ids.length > 0) {
        const lessonData = lesson_ids.map(lesson_id => ({
          student_id: student.id,
          lesson_id,
          school_id
        }));
        await StudentLessons.bulkCreate(lessonData);
      }
  
      // Send welcome notification
      await sendWelcomeNotification({
        school_id,
        full_name,
        email,
        phone,
        plainPassword,
      });
  
      res.status(201).json({ message: 'Student created', student });
    } catch (error) {
      console.error('Create student error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findOne({
      where: { user_id: id },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] },
        { model: Parent, as: 'parent' },
        { model: Class, as: 'class' }
      ],
    });

    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email', 'role', 'school_id'] },
        { model: Parent, as: 'parent' },
        { model: Class, as: 'class' }
      ],
    });

    res.json(students);
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New: Get students by school_id
exports.getStudentsBySchoolId = async (req, res) => {
  try {
    const { school_id } = req.params;

    const students = await Student.findAll({
      where: { school_id },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { model: Parent, as: 'parent' },
        { model: Class, as: 'class' }
      ]
    });

    res.json(students);
  } catch (error) {
    console.error('Get students by school error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New: Get students by class_id
exports.getStudentsByClassId = async (req, res) => {
  try {
    const { class_id } = req.params;

    // Validate class exists
    const classExists = await Class.findByPk(class_id);
    if (!classExists) return res.status(400).json({ message: 'Class not found' });

    const students = await Student.findAll({
      where: { class_id },
      include: [
        { model: User, as: 'user', attributes: ['full_name', 'email'] },
        { model: Parent, as: 'parent' },
        { model: Class, as: 'class' }
      ]
    });

    res.json(students);
  } catch (error) {
    console.error('Get students by class error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name, email, password,
      admission_number, class_id, parent_id,
      phone, address, blood_type, gender, birthday, date_of_birth
    } = req.body;

    const img = req.file ? req.file.filename : null;

    const student = await Student.findOne({ where: { user_id: id } });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (parent_id) {
      const parent = await Parent.findByPk(parent_id);
      if (!parent) return res.status(400).json({ message: 'Parent not found' });
    }

    if (class_id) {
      const classExists = await Class.findByPk(class_id);
      if (!classExists) return res.status(400).json({ message: 'Class not found' });
    }

    await student.update({
      admission_number,
      class_id,
      parent_id,
      phone,
      address,
      img,
      blood_type,
      gender,
      birthday,
      date_of_birth
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

    res.json({ message: 'Student updated', student, user });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Soft delete by clearing role (or you could add an is_active flag)
    user.role = null;
    await user.save();

    res.json({ message: 'Student deactivated' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getStudentsBySchoolAndClassId = async (req, res) => {
    try {
      const { school_id, class_id } = req.params;
  
      // Validate class exists and belongs to the school (optional but recommended)
      const classExists = await Class.findOne({ where: { id: class_id, school_id } });
      if (!classExists) return res.status(400).json({ message: 'Class not found for this school' });
  
      const students = await Student.findAll({
        where: { school_id, class_id },
        include: [
          { model: User, as: 'user', attributes: ['full_name', 'email', 'role'] },
          { model: Parent, as: 'parent' }
        ]
      });
  
      res.json(students);
    } catch (error) {
      console.error('Get students by school and class error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getStudentsBySchoolIdAndSearch = async (req, res) => {
  try {
    const { school_id } = req.params;
     const { q } = req.query;
    
        if (!q) return res.status(400).json({ message: 'Search query (q) is required' });
    
        const students = await Student.findAll({
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
    

    res.json(students);
  } catch (error) {
    console.error('Get students by school and search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
