const express = require('express');
const router = express.Router();
const gradeSchemeController = require('../controllers/gradeSchemeControllers');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Create - only super_admin, school_super_admin, school_admin allowed
router.post(
  '/',
  authorizeRoles('super_admin', 'school_super_admin', 'school_admin'),
  gradeSchemeController.createGradeScheme
);

// Get all grade schemes (any authenticated user can view)
router.get('/', gradeSchemeController.getGradeSchemes);

// Get one grade scheme by ID
router.get('/:id', gradeSchemeController.getGradeSchemeById);

// Update - only super_admin, school_super_admin, school_admin allowed
router.put(
  '/:id',
  authorizeRoles('super_admin', 'school_super_admin', 'school_admin'),
  gradeSchemeController.updateGradeScheme
);

// Delete - only super_admin, school_super_admin, school_admin allowed
router.delete(
  '/:id',
  authorizeRoles('super_admin', 'school_super_admin', 'school_admin'),
  gradeSchemeController.deleteGradeScheme
);

module.exports = router;
