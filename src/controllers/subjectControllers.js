const { Subject, School, Teacher, Class, Student, Lesson, Sequelize } = require('../../models');
const { Op } = Sequelize;

// Create a new subject
exports.createSubject = async (req, res) => {
  try {
    const { name, school_id } = req.body;

    const existing = await Subject.findOne({ where: { name, school_id } });
    if (existing) {
      return res.status(400).json({ message: 'Subject already exists for this school.' });
    }

    const subject = await Subject.create({ name, school_id });
    res.status(201).json({ message: 'Subject created successfully.', subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all subjects (optionally by school_id)
exports.getAllSubjects = async (req, res) => {
  try {
    const { school_id } = req.query;
    const where = school_id ? { school_id } : {};

    const subjects = await Subject.findAll({
      where,
      include: [
        { model: School, as: 'school' },
        { model: Teacher, as: 'teachers' },
        { model: Class, as: 'classes' },
        { model: Student, as: 'students' },
        { model: Lesson, as: 'lessons' }
      ]
    });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get a subject by its ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id, {
      include: [
        { model: School, as: 'school' },
        { model: Teacher, as: 'teachers' },
        { model: Class, as: 'classes' },
        { model: Student, as: 'students' },
        { model: Lesson, as: 'lessons' }
      ]
    });

    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    res.status(200).json({ subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, school_id } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    if (name && name !== subject.name) {
      const existing = await Subject.findOne({ where: { name, school_id } });
      if (existing) return res.status(400).json({ message: 'Another subject with this name exists in the school.' });
    }

    await subject.update({ name, school_id });
    res.status(200).json({ message: 'Subject updated successfully.', subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findByPk(id);
    if (!subject) return res.status(404).json({ message: 'Subject not found.' });

    await subject.destroy();
    res.status(200).json({ message: 'Subject deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by school ID
exports.getSubjectBySchoolID = async (req, res) => {
  try {
    const { school_id } = req.params;

    const subjects = await Subject.findAll({
      where: { school_id },
      include: [{ model: School, as: 'school' }]
    });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by school ID and name search
exports.getSubjectBySchoolIDandSearch = async (req, res) => {
  try {
    const { school_id } = req.params;
    const { query } = req.query;

    const subjects = await Subject.findAll({
      where: {
        school_id,
        name: { [Op.like]: `%${query}%` }
      },
      include: [{ model: School, as: 'school' }]
    });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by lesson ID
exports.getSubjectByLessonID = async (req, res) => {
  try {
    const { lesson_id } = req.params;

    const lesson = await Lesson.findByPk(lesson_id, {
      include: [{ model: Subject, as: 'subject' }]
    });

    if (!lesson || !lesson.subject) {
      return res.status(404).json({ message: 'Lesson or subject not found.' });
    }

    res.status(200).json({ subject: lesson.subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by class ID
exports.getSubjectByClassID = async (req, res) => {
  try {
    const { class_id } = req.params;

    const classSubjects = await Class.findByPk(class_id, {
      include: [{ model: Subject, as: 'subjects' }]
    });

    if (!classSubjects) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.status(200).json({ subjects: classSubjects.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by school ID and class ID
exports.getSubjectBySchoolIDandClassId = async (req, res) => {
  try {
    const { school_id, class_id } = req.params;

    const subjects = await Subject.findAll({
      where: { school_id },
      include: [
        {
          model: Class,
          as: 'classes',
          where: { id: class_id },
          required: true // ensures inner join
        }
      ]
    });

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ Get subjects by teacher ID
exports.getSubjectByTeacherID = async (req, res) => {
  try {
    const { teacher_id } = req.params;

    const subjects = await Subject.findAll({
      include: [
        {
          model: Teacher,
          as: 'teachers',
          where: { id: teacher_id },
          attributes: ['id', 'full_name']
        }
      ]
    });

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this teacher.' });
    }

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get subjects by school ID, teacher ID and search
exports.getSubjectBySchoolIDandTeacherIDandSearch = async (req, res) => {
  try {
    const { school_id, teacher_id } = req.params;
    const { query } = req.query;

    const subjects = await Subject.findAll({
      where: { school_id },
      include: [
        {
          model: Teacher,
          as: 'teachers',
          where: { id: teacher_id },
          attributes: ['id', 'full_name']
        }
      ],
      where: {
        name: { [Op.like]: `%${query}%` }
      }
    });

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this teacher.' });
    }

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get subjects by school ID and teacher ID
exports.getSubjectBySchoolIDandTeacherID = async (req, res) => {
  try {
    const { school_id, teacher_id } = req.params;

    const subjects = await Subject.findAll({
      where: { school_id },
      include: [
        {
          model: Teacher,
          as: 'teachers',
          where: { id: teacher_id },
          attributes: ['id', 'full_name']
        }
      ]
    });

    if (!subjects.length) {
      return res.status(404).json({ message: 'No subjects found for this teacher.' });
    }

    res.status(200).json({ subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
};
