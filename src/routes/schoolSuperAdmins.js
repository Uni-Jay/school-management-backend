const express = require('express');
const router = express.Router();
const schoolSuperAdminController = require('../controllers/schoolSuperAdminControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('schoolSuperAdmins');

// All routes require authentication
router.use(jwtAuth);

router.post('/',roleAuth(['super_admin']), upload.single('img'), schoolSuperAdminController.createSchoolSuperAdmin);
router.get('/', schoolSuperAdminController.getAllSchoolSuperAdmins);
router.get('/:id', schoolSuperAdminController.getSchoolSuperAdminById);
router.put('/:id',roleAuth(['super_admin']), upload.single('img'), schoolSuperAdminController.updateSchoolSuperAdmin);
router.patch('/:id/deactivate',roleAuth(['super_admin']), schoolSuperAdminController.softDeleteSchoolSuperAdmin);
router.patch('/:id/reactivate',roleAuth(['super_admin']), schoolSuperAdminController.reactivateSchoolSuperAdmin);
router.get('/school/:school_id', schoolSuperAdminController.getSchoolSuperAdminBySchoolID);
router.get('/school/:school_id/search', schoolSuperAdminController.getSchoolSuperAdminBySchoolIDandSearch);

module.exports = router;
