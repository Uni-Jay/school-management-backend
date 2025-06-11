const express = require('express');
const router = express.Router();

const examController = require('../controllers/examControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');
const rolesAllowedForQuestions = ['superadmin', 'schoolSuperadmin', 'schoolAdmin', 'teacher'];
const rolesAllowedForAdminView = ['superadmin', 'schoolSuperadmin', 'schoolAdmin', 'teacher', 'parent', 'student'];

// Exam CRUD
router.post('/create', jwtAuth, roleAuth(['superadmin', 'schoolSuperadmin', 'schoolAdmin', 'teacher']), examController.createExam);
router.get('/class/:class_id', jwtAuth, examController.getExamsByClass);
router.get('/teacher/:teacher_id', jwtAuth, examController.getExamsByTeacher);
router.get('/subject/:subject_id', jwtAuth, examController.getExamsBySubject);

// Question CRUD (create/update by rolesAllowedForQuestions)
router.post('/question', jwtAuth, roleAuth(rolesAllowedForQuestions), examController.createQuestion);
router.put('/question/:question_id', jwtAuth, roleAuth(rolesAllowedForQuestions), examController.updateQuestion);
router.post('/option', jwtAuth, roleAuth(rolesAllowedForQuestions), examController.addOption);
router.get('/question/preview/:exam_id', jwtAuth, roleAuth(rolesAllowedForQuestions), examController.previewQuestions);

// Student submits answers & exam
router.post('/answer', jwtAuth, roleAuth(['student']), examController.submitAnswer);
router.post('/submit', jwtAuth, roleAuth(['student']), examController.submitExam);

// Scores and reports
router.get('/scores/me', jwtAuth, roleAuth(['student, parent']), examController.getStudentScores);
router.get('/results/all', jwtAuth, roleAuth(['superadmin', 'schoolSuperadmin', 'schoolAdmin', 'teacher']), examController.getAllStudentResults);
router.get('/reports/student/:student_id', jwtAuth, examController.getStudentReports);

module.exports = router;
