const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lessonControllers');
const roleAuth = require('../middlewares/roleAuth'); // Adjust the path as needed
const jwtAuth = require('../middlewares/jwtAuth');

// JWT Auth middleware for all routes
router.use(jwtAuth);

// Create lesson
router.post(
  '/',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  LessonController.createLesson
);

// Get all lessons
router.get('/', LessonController.getAllLessons);

// Search lessons by name query
// Example: /api/lessons/search?query=Math
router.get('/search', LessonController.getLessonsBySchoolIdAndSearch);

// Get lessons by subject ID
router.get('/subject/:subject_id', LessonController.getLessonsBySubjectId);

// Get lessons by class ID
router.get('/class/:class_id', LessonController.getLessonsByClassId);

// Get lessons by teacher ID
router.get('/teacher/:teacher_id', LessonController.getLessonsByTeacherId);

// Get lessons by day
router.get('/day/:day', LessonController.getLessonsByDay);

// Get a single lesson by ID
router.get('/:id', LessonController.getLessonById);

// Update lesson
router.put(
  '/:id',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  LessonController.updateLesson
);

// Delete lesson
router.delete(
  '/:id',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  LessonController.deleteLesson
);

module.exports = router;
