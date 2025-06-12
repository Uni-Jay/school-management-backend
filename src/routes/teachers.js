const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('teachers');

// All routes require authentication
router.use(jwtAuth);

// Create a new teacher
router.post('/',roleAuth(['super_admin', 'school_super_admin', 'school_admin']),  upload.single('img'), teacherController.createTeacher);

// Get all teachers
router.get('/', teacherController.getAllTeachers);

// Get teacher by user ID
router.get('/:id', teacherController.getTeacherById);

// Update teacher by user ID
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin']),  upload.single('img'), teacherController.updateTeacher);

// Soft delete teacher by user ID
router.delete('/:id', teacherController.deleteTeacher);

// Get teachers by school ID
router.get('/school/:school_id', teacherController.getTeacherBySchoolId);

// Search teachers by school ID and query (full_name or email)
router.get('/school/:school_id/search', teacherController.getTeacherBySchoolIDandSearch);

// Get teachers by school ID and subject ID
router.get('/school/:school_id/subject/:subject_id', teacherController.getTeacherBySchoolIDandSubjectID);

// Get teacher by lesson ID
router.get('/lesson/:lesson_id', teacherController.getTeacherByLesson);

module.exports = router;
