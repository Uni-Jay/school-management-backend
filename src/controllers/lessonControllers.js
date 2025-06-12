const { Lesson, Subject, Class, Teacher } = require('../../models');
const { Op } = require('sequelize');

// Create a new lesson
exports.createLesson = async (req, res) => {
  try {
    const {
      name, day, start_time, end_time,
      subject_id, class_id, teacher_id
    } = req.body;

    const school_id = req.user.school_id;

    const lesson = await Lesson.create({
      name,
      day,
      start_time,
      end_time,
      subject_id,
      class_id,
      teacher_id,
      school_id
    });

    res.status(201).json({ message: 'Lesson created successfully', lesson });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

// Get all lessons for the school
exports.getAllLessons = async (req, res) => {
  try {
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { school_id },
      include: [
        { model: Subject, as: 'subject', attributes: ['id', 'name'] },
        { model: Class, as: 'class', attributes: ['id', 'name'] },
        { model: Teacher, as: 'teacher', attributes: ['id', 'full_name'] }
      ],
      order: [['day', 'ASC'], ['start_time', 'ASC']]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// Get lesson by ID
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const lesson = await Lesson.findOne({
      where: { id, school_id },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Teacher, as: 'teacher' }
      ]
    });

    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    res.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
};

// Update lesson
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const lesson = await Lesson.findOne({ where: { id, school_id } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    const {
      name, day, start_time, end_time,
      subject_id, class_id, teacher_id
    } = req.body;

    await lesson.update({
      name, day, start_time, end_time,
      subject_id, class_id, teacher_id
    });

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

// Delete lesson
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const lesson = await Lesson.findOne({ where: { id, school_id } });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    await lesson.destroy();
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};

// ✅ Get lessons by subject ID
exports.getLessonsBySubjectId = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { subject_id, school_id },
      include: [
        { model: Class, as: 'class' },
        { model: Teacher, as: 'teacher' }
      ]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons by subject:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// ✅ Get lessons by class ID
exports.getLessonsByClassId = async (req, res) => {
  try {
    const { class_id } = req.params;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { class_id, school_id },
      include: [
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher' }
      ]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons by class:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// ✅ Get lessons by teacher ID
exports.getLessonsByTeacherId = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { teacher_id, school_id },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' }
      ]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons by teacher:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// ✅ Get lessons by day (e.g., Monday)
exports.getLessonsByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { day, school_id },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Teacher, as: 'teacher' }
      ],
      order: [['start_time', 'ASC']]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons by day:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};

// ✅ Get lessons by name search (e.g., partial match)
exports.getLessonsBySchoolIdAndSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: {
        school_id,
        name: { [Op.like]: `%${query}%` }
      },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Teacher, as: 'teacher' }
      ]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error searching lessons:', error);
    res.status(500).json({ error: 'Failed to search lessons' });
  }
};
// ✅ Get lessons by subject ID and class ID
exports.getLessonsBySubjectAndClass = async (req, res) => {
  try {
    const { subject_id, class_id } = req.params;
    const school_id = req.user.school_id;

    const lessons = await Lesson.findAll({
      where: { subject_id, class_id, school_id },
      include: [
        { model: Subject, as: 'subject' },
        { model: Class, as: 'class' },
        { model: Teacher, as: 'teacher' }
      ]
    });

    res.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons by subject and class:', error);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
};