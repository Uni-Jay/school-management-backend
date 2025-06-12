const express = require('express');
const router = express.Router();
const controller = require('../controllers/schoolSuperAdminControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('schoolSuperAdmins');

// All routes require authentication
router.use(jwtAuth);

router.post('/',roleAuth(['super_admin']), upload.single('img'), controller.createSchoolSuperAdmin);
router.get('/', controller.getAllSchoolSuperAdmins);
router.get('/:id', controller.getSchoolSuperAdminById);
router.put('/:id',roleAuth(['super_admin']), upload.single('img'), controller.updateSchoolSuperAdmin);
router.patch('/:id/deactivate',roleAuth(['super_admin']), controller.softDeleteSchoolSuperAdmin);
router.patch('/:id/reactivate',roleAuth(['super_admin']), controller.reactivateSchoolSuperAdmin);
router.get('/school/:school_id', controller.getSchoolSuperAdminBySchoolID);
router.get('/school/:school_id/search', controller.getSchoolSuperAdminBySchoolIDandSearch);

module.exports = router;
