const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lessonControllers');
const roleAuth = require('../middlewares/roleAuth'); // Adjust the path as necessary
const jwtAuth = require('../middlewares/jwtAuth');


// Auth middleware
router.use(jwtAuth);

router.post('/',roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), LessonController.createLesson);
router.get('/', LessonController.getAllLessons);
router.get('/:id', LessonController.getLessonById);
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), LessonController.updateLesson);
router.delete('/:id', LessonController.deleteLesson);

module.exports = router;
