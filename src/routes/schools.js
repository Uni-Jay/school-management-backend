const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolControllers');
const createUploadMiddleware = require('../middlewares/upload');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');


const upload = createUploadMiddleware('schoolAdmins');

// All routes require authentication
router.use(jwtAuth);

router.post('/', upload.single('logo_url'), schoolController.createSchool);
router.get('/', schoolController.getAllSchools);
router.get('/search', schoolController.searchSchoolsByName);
router.get('/:id', schoolController.getSchoolById);
router.put('/:id', upload.single('logo_url'), schoolController.updateSchool);
router.patch('/:id/deactivate', schoolController.deactivateSchool);
router.patch('/:id/reactivate', schoolController.reactivateSchool);

module.exports = router;
