const express = require('express');
const router = express.Router();
const gradeSchemeController = require('../controllers/gradeSchemeControllers');
const roleAuth = require('../middlewares/roleAuth'); // Adjust the path as necessary
const jwtAuth = require('../middlewares/jwtAuth');


// Auth middleware
router.use(jwtAuth);

// Create - only super_admin, school_super_admin, school_admin allowed
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), gradeSchemeController.createGradeScheme);

// Get all grade schemes (any authenticated user can view)
router.get('/', gradeSchemeController.getGradeSchemes);

// Get one grade scheme by ID
router.get('/:id', gradeSchemeController.getGradeSchemeById);

// Update - only super_admin, school_super_admin, school_admin allowed
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), gradeSchemeController.updateGradeScheme);

// Delete - only super_admin, school_super_admin, school_admin allowed
router.delete('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin',]),gradeSchemeController.deleteGradeScheme);

module.exports = router;
