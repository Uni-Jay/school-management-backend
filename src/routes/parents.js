const express = require('express');
const router = express.Router();
const {createParent, listParents, updateParent, deleteParent,} = require('../controllers/parentController');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');

// All routes require authentication
router.use(jwtAuth);

// CRUD
router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), createParent);
router.get('/', listParents);  // any authenticated user can list/search
router.put('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), updateParent);
router.delete('/:id', roleAuth(['super_admin', 'school_super_admin', 'school_admin']), deleteParent);


module.exports = router;

