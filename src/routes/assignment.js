const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignmentsController');
const roleAuth = require('../middlewares/roleAuth');
const jwtAuth = require('../middlewares/jwtAuth'); // assume you have a JWT auth middleware

// Middleware to verify JWT and attach user to req.user
router.use(jwtAuth);

// Routes

// Create assignment - only allowed roles
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), assignmentsController.createAssignment);

// Update assignment - only allowed roles
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin', 'teacher']), assignmentsController.updateAssignment);

// Get all assignments - any authenticated user
router.get('/', assignmentsController.getAllAssignments);

// Get assignment by ID - any authenticated user
router.get('/:id', assignmentsController.getAssignmentById);

// Student submits an assignment (example endpoint)
router.post('/:id/submit', roleAuth(['student']), assignmentsController.submitAssignment);

module.exports = router;
// Note: Ensure that the roleAuth middleware checks the user's role and allows access accordingly.
// Note: The jwtAuth middleware should verify the JWT and attach the user object to req.user