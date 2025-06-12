const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const jwtAuth = require('../middlewares/jwtAuth');
const roleAuth = require('../middlewares/roleAuth');



// All routes require authentication
router.use(jwtAuth);
// Role-based access control for user management

router.post('/',roleAuth(['super_admin',]), userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/search', userController.searchUsers);
router.get('/by-role/:role', userController.getUsersByRole);
router.get('/by-school/:school_id', userController.getUsersBySchoolId);
router.get('/filter', userController.getUsersBySchoolAndRole);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.patch('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/reactivate', userController.reactivateUser);

module.exports = router;
// router.delete('/:id', controller.deleteUser); // Uncomment if you want to allow user deletion
// router.get('/by-school/:school_id', controller.getUsersBySchoolId); // Uncomment if you want to allow fetching users by school ID