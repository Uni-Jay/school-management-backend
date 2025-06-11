const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceControllers');
const roleAuth = require('../middlewares/roleAuth');
const jwtAuth = require('../middlewares/jwtAuth');

// Auth middleware
router.use(jwtAuth);

// Create attendance
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), attendanceController.createAttendance);

// Update attendance
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), attendanceController.updateAttendance);

// Get all attendance
router.get('/', attendanceController.getAllAttendance);

// // ✅ Place more specific route first
// router.get('/student/:student_id/lesson/:lesson_id', attendanceController.getAttendanceByStudentAndLesson);

// Get attendance by student
router.get('/student/:student_id', attendanceController.getAttendanceByStudent);

// Get attendance by lesson
router.get('/lesson/:lesson_id', attendanceController.getAttendanceByLesson);

// Get attendance by date
router.get('/date/:date', attendanceController.getAttendanceByDate);

// Get one attendance by ID
router.get('/:id', attendanceController.getAttendanceById);

// Delete attendance
router.delete('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), attendanceController.deleteAttendance);

module.exports = router;
