const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');



// All routes require authentication
router.use(jwtAuth);

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.post('/',roleAuth(['super_admin', 'school_super_admin', 'school_admin']), subjectController.createSubject);
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin']), subjectController.updateSubject);
router.delete('/:id', subjectController.deleteSubject);

// Custom filters
router.get('/school/:school_id', subjectController.getSubjectBySchoolID);
router.get('/school/:school_id/search', subjectController.getSubjectBySchoolIDandSearch);
router.get('/lesson/:lesson_id', subjectController.getSubjectByLessonID);
router.get('/class/:class_id', subjectController.getSubjectByClassID);
router.get('/school/:school_id/class/:class_id', subjectController.getSubjectBySchoolIDandClassId);
router.get('/school/:school_id/teacher/:teacher_id', subjectController.getSubjectBySchoolIDandTeacherID);
router.get('/school/:school_id/teacher/:teacher_id/search', subjectController.getSubjectBySchoolIDandTeacherIDandSearch);

module.exports = router;
