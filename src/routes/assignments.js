const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignmentControllers');
const roleAuth = require('../middlewares/roleAuth');
const jwtAuth = require('../middlewares/jwtAuth');

// JWT Auth middleware for all routes
router.use(jwtAuth);

// Create assignment - only allowed roles
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), assignmentsController.createAssignment);

// Update assignment - only allowed roles
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), assignmentsController.updateAssignment);

// Student submits an assignment (must be before get by id to avoid route conflict)
router.post('/:id/submit', roleAuth(['student']), assignmentsController.submitAssignment);

// Get assignment by ID - any authenticated user
router.get('/:id', assignmentsController.getAssignmentById);

// Get all assignments - any authenticated user
router.get('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), assignmentsController.getAllAssignments);

module.exports = router;