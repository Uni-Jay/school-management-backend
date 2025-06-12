const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('students');

// All routes require authentication
router.use(jwtAuth);

// Create a new student
router.post('/',roleAuth(['super_admin', 'school_super_admin', 'school_admin']),  upload.single('img'), studentController.createStudent);

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by user ID
router.get('/:id', studentController.getStudentById);

// Update student by user ID
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin']), upload.single('img'), studentController.updateStudent);

// Soft delete (deactivate) student by user ID
router.delete('/:id', studentController.deleteStudent);

// Get all students by school ID
router.get('/school/:school_id', studentController.getStudentsBySchoolId);

// Get all students by class ID
router.get('/class/:class_id', studentController.getStudentsByClassId);

// Get students by both school ID and class ID
router.get('/school/:school_id/class/:class_id', studentController.getStudentsBySchoolAndClassId);

// Get students by school ID and search term
router.get('/school/:school_id/search', studentController.getStudentsBySchoolIdAndSearch);


module.exports = router;
