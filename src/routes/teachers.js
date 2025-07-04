const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('teachers');

// All routes require authentication
// All routes require authentication
router.use(jwtAuth);

// ✅ Create teacher
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), upload.single('img'), teacherController.createTeacher);

// ✅ Get all teachers
router.get('/', teacherController.getAllTeachers);

// ✅ 🔍 SEARCH (MUST be before :id)
router.get('/search', teacherController.getTeacherByFullNameOrEmail);

// ✅ Get teacher by lesson ID
router.get('/lesson/:lesson_id', teacherController.getTeacherByLesson);

// ✅ Get teachers by school ID and subject ID
router.get('/school/:school_id/subject/:subject_id', teacherController.getTeacherBySchoolIDandSubjectID);

// ✅ Get teachers by school ID
router.get('/school/:school_id', teacherController.getTeacherBySchoolId);

// ✅ Get teacher by user ID (keep this last to avoid conflicts)
router.get('/:id', teacherController.getTeacherById);

// ✅ Update teacher
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), upload.single('img'), teacherController.updateTeacher);

// ✅ Delete teacher
router.delete('/:id', teacherController.deleteTeacher);


module.exports = router;
