const express = require('express');
const router = express.Router();
const roleAuth = require('../middlewares/roleAuth'); // Adjust the path as necessary
const announcementController = require('../controllers/annoucementControllers'); // Adjust the path as necessary
const jwtAuth = require('../middlewares/jwtAuth'); // Adjust the path as necessary

const allowedRolesToCreate = ['super_admin', 'school_super_admin', 'school_admin',];

// All routes require authentication
router.use(jwtAuth);

// Protect the create announcement route
router.post('/', roleAuth(allowedRolesToCreate), announcementController.createAnnouncement);

router.get('/', announcementController.getAllAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);
router.put('/:id', roleAuth(allowedRolesToCreate), announcementController.updateAnnouncement);
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
// This code sets up the routes for managing announcements in the application.
// It includes routes for creating, retrieving, updating, and deleting announcements,
// with role-based access control to ensure that only authorized users can create or modify announcements.
// The `roleAuth` middleware checks the user's role before allowing access to the create and update routes.
