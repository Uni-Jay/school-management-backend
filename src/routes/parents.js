const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentControllers');
const createUploadMiddleware = require('../middlewares/upload'); // this is a function
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');

// ✅ Create upload middleware specifically for parents
const upload = createUploadMiddleware('parents');

// All routes require authentication
router.use(jwtAuth);

router.post(
  '/',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  upload.single('img'),
  parentController.createParent
);

router.get('/', parentController.getAllParents);

router.get('/:id', parentController.getParentById);

router.put(
  '/:id',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  upload.single('img'),
  parentController.updateParent
);

router.delete(
  '/:id',
  roleAuth(['super_admin', 'school_super_admin', 'school_admin']),
  parentController.deleteParent
);

// ✅ Additional routes:
router.get('/school/:school_id', parentController.getParentBySchoolID);
router.get('/school/:school_id/search', parentController.getParentBySchoolIDandSearch);
router.get('/student/:student_id', parentController.getParentsByStudentId);

module.exports = router;
