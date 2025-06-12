const express = require('express');
const router = express.Router();
const schoolAdminController = require('../controllers/schoolAdminControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('schoolAdmins');

// All routes require authentication
router.use(jwtAuth);

router.post('/',roleAuth(['super_admin', 'school_super_admin']), upload.single('img'), schoolAdminController.createSchoolAdmin);
router.get('/', schoolAdminController.getAllSchoolAdmins);
router.get('/:id', schoolAdminController.getSchoolAdminById);
router.put('/:id',roleAuth(['super_admin', 'school_super_admin',]), upload.single('img'), schoolAdminController.updateSchoolAdmin);
router.patch('/:id/deactivate',roleAuth(['super_admin', 'school_super_admin']), schoolAdminController.softDeleteSchoolAdmin);
router.patch('/:id/reactivate',roleAuth(['super_admin', 'school_super_admin']), schoolAdminController.reactivateSchoolAdmin);
router.get('/school/:school_id', schoolAdminController.getSchoolAdminsBySchoolID);
router.get('/school/:school_id/search', schoolAdminController.searchSchoolAdminsBySchoolID);

module.exports = router;
