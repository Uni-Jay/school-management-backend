const { Attendance, Student, Lesson } = require('../models');

// ✅ Create attendance
exports.createAttendance = async (req, res) => {
  try {
    const { student_id, lesson_id, status, date } = req.body;
    const school_id = req.user.school_id;

    const attendance = await Attendance.create({
      student_id,
      lesson_id,
      status,
      date,
      school_id
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create attendance' });
  }
};

// ✅ Update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });

    // Authorization: Must belong to the same school
    if (req.user.role !== 'super_admin' && attendance.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    attendance.status = status || attendance.status;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// ✅ Get all attendance (with optional filters)
exports.getAllAttendance = async (req, res) => {
  try {
    const { student_id, lesson_id, date } = req.query;

    const where = {
      school_id: req.user.role === 'super_admin' ? undefined : req.user.school_id,
      ...(student_id && { student_id }),
      ...(lesson_id && { lesson_id }),
      ...(date && { date })
    };

    const attendanceRecords = await Attendance.findAll({ where });
    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

// ✅ Get one attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ error: 'Not found' });

    if (req.user.role !== 'super_admin' && attendance.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching attendance' });
  }
};
// ✅ Get attendance by student
exports.getAttendanceByStudent = async (req, res) => {
  try {
    const student_id = req.params.student_id;
    const attendanceRecords = await Attendance.findAll({
      where: { student_id, school_id: req.user.school_id }
    });

    if (!attendanceRecords.length) return res.status(404).json({ error: 'No attendance records found for this student' });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records for student' });
  }
};
// ✅ Get attendance by lesson
exports.getAttendanceByLesson = async (req, res) => {
  try {
    const lesson_id = req.params.lesson_id;
    const attendanceRecords = await Attendance.findAll({
      where: { lesson_id, school_id: req.user.school_id }
    });

    if (!attendanceRecords.length) return res.status(404).json({ error: 'No attendance records found for this lesson' });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records for lesson' });
  }
};
// ✅ Get attendance by date
exports.getAttendanceByDate = async (req, res) => {
  try {
    const date = req.params.date;
    const attendanceRecords = await Attendance.findAll({
      where: { date, school_id: req.user.school_id }
    });

    if (!attendanceRecords.length) return res.status(404).json({ error: 'No attendance records found for this date' });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records for date' });
  }
};
// ✅ Get attendance by student and lesson
exports.getAttendanceByStudentAndLesson = async (req, res) => {
  try {
    const { student_id, lesson_id } = req.params;
    const attendanceRecords = await Attendance.findAll({
      where: { student_id, lesson_id, school_id: req.user.school_id }
    });

    if (!attendanceRecords.length) return res.status(404).json({ error: 'No attendance records found for this student and lesson' });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records for student and lesson' });
  }
};
// delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await Attendance.findByPk(id);
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });

    // Authorization: Must belong to the same school
    if (req.user.role !== 'super_admin' && attendance.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await attendance.destroy();
    res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
};