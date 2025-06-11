const { Attendance } = require('../../models');

// Helper to apply school scope if not super_admin
const applySchoolScope = (query, user) => {
  if (user.role !== 'super_admin') {
    query = Attendance.scope({ method: ['bySchool', user.school_id] });
  } else {
    query = Attendance;
  }
  return query;
};

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

    const attendance = await Attendance.findByPk(id);
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });

    if (req.user.role !== 'super_admin' && attendance.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    attendance.status = req.body.status ?? attendance.status;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
};

// ✅ Get all attendance with optional filters
exports.getAllAttendance = async (req, res) => {
  try {
    const { student_id, lesson_id, date } = req.query;

    let query = applySchoolScope(null, req.user);
    const where = {};
    if (student_id) where.student_id = student_id;
    if (lesson_id) where.lesson_id = lesson_id;
    if (date) where.date = date;

    const attendanceRecords = await query.findAll({ where });
    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
};

// ✅ Get attendance by ID
exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });

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
    const { student_id } = req.params;

    let query = applySchoolScope(null, req.user);
    const attendanceRecords = await query.findAll({ where: { student_id } });

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
    const { lesson_id } = req.params;

    let query = applySchoolScope(null, req.user);
    const attendanceRecords = await query.findAll({ where: { lesson_id } });

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
    const { date } = req.params;

    let query = applySchoolScope(null, req.user);
    const attendanceRecords = await query.findAll({ where: { date } });

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

    let query = applySchoolScope(null, req.user);
    const attendanceRecords = await query.findAll({ where: { student_id, lesson_id } });

    if (!attendanceRecords.length) return res.status(404).json({ error: 'No attendance records found for this student and lesson' });

    res.json(attendanceRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch attendance records for student and lesson' });
  }
};

// ✅ Delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await Attendance.findByPk(id);
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });

    if (req.user.role !== 'super_admin' && attendance.school_id !== req.user.school_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await attendance.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete attendance' });
  }
};
