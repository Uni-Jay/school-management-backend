const express = require('express');
const router = express.Router();
const schoolSuperAdminController = require('../controllers/schoolSuperAdminControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');

const upload = createUploadMiddleware('schoolSuperAdmins');

// ✅ All routes require authentication
router.use(jwtAuth);

// ✅ Create School Super Admin
router.post('/', roleAuth(['super_admin']), upload.single('img'), schoolSuperAdminController.createSchoolSuperAdmin);

// ✅ Get all School Super Admins
router.get('/', schoolSuperAdminController.getAllSchoolSuperAdmins);

// ✅ 🔍 Search (MUST come before `/:id`)
router.get('/search', schoolSuperAdminController.searchSchoolSuperAdmins);

// ✅ Get by School ID
router.get('/school/:school_id', schoolSuperAdminController.getSchoolSuperAdminBySchoolID);

// ✅ 🔍 Search by School ID (MUST come before `/school/:school_id`)
router.get('/school/:school_id/search', schoolSuperAdminController.getSchoolSuperAdminBySchoolIDandSearch);

// ✅ Get by ID (MUST come after /search routes)
router.get('/:id', schoolSuperAdminController.getSchoolSuperAdminById);

// ✅ Update
router.put('/:id', roleAuth(['super_admin']), upload.single('img'), schoolSuperAdminController.updateSchoolSuperAdmin);

// ✅ Delete
router.delete('/:id', roleAuth(['super_admin']), schoolSuperAdminController.deleteSchoolSuperAdmin);

module.exports = router;
