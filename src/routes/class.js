const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');

router.use(jwtAuth);

// Create class
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.createClass);

// Update class
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.updateClass);

// Delete class
router.delete('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.deleteClass);

// Get all classes
router.get('/', classController.getAllClasses);

// Get class by ID
router.get('/:id', classController.getClassById);
// Get classes by school ID
router.get('/school/:schoolId', classController.getClassesBySchoolId);
// Get classes by grade level
router.get('/grade/:gradeLevel', classController.getClassesByGradeLevel);
// Get classes by teacher ID
router.get('/teacher/:teacherId', classController.getClassesByTeacherId);
// Get classes by student ID
router.get('/student/:studentId', classController.getClassesByStudentId);


module.exports = router;
