const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');
const createUploadMiddleware = require('../middlewares/upload');

router.use(jwtAuth);
const upload = createUploadMiddleware('superAdmins');
router.use(roleAuth(['super_admin']));

router.post('/',upload.single('img'), superAdminController.createSuperAdmin);
router.get('/', superAdminController.getAllSuperAdmins);
router.get('/:id', superAdminController.getSuperAdminById);
router.put('/:id',upload.single('img'), superAdminController.updateSuperAdmin);
router.delete('/:id', superAdminController.deleteSuperAdmin);

module.exports = router;
