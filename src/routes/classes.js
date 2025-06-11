const express = require('express');
const router = express.Router();
const classController = require('../controllers/classControllers');
const roleAuth = require('../middlewares/roleAuth'); // Adjust the path as necessary
const jwtAuth = require('../middlewares/jwtAuth');

router.use(jwtAuth);

// Create class
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.createClass);

// Update class
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.updateClass);

// Delete class
router.delete('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), classController.deleteClass);

// Get all classes
router.get('/', classController.getAllClasses);

// Get Classes by teacher ID
router.get('/teacher/:teacherId', classController.getClassesByTeacherId);

// Get classes by school ID
router.get('/school/:schoolId', classController.getClassesBySchoolId);


// Get class by ID (keep this LAST among GETs with params)
router.get('/:id', classController.getClassById);



module.exports = router;
