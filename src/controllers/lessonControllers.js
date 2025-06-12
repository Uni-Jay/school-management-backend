const { Lesson, Subject, Class, Teacher } = require('../../models');

exports.createLesson = async (req, res) => {
  try {
    const {
      name,
      day,
      start_time,
      end_time,
      subject_id,
      class_id,
      teacher_id
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

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json({ lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const lesson = await Lesson.findOne({ where: { id, school_id } });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const {
      name,
      day,
      start_time,
      end_time,
      subject_id,
      class_id,
      teacher_id
    } = req.body;

    await lesson.update({
      name,
      day,
      start_time,
      end_time,
      subject_id,
      class_id,
      teacher_id
    });

    res.json({ message: 'Lesson updated successfully', lesson });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const school_id = req.user.school_id;

    const lesson = await Lesson.findOne({ where: { id, school_id } });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    await lesson.destroy();

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};
