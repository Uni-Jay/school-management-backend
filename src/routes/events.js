const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const roleAuth = require('../middlewares/roleAuth');
const jwtAuth = require('../middlewares/jwtAuth');

// Auth middleware
router.use(jwtAuth);


router.post('/', roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.put('/:id',roleAuth(['super_admin', 'school_super_admin', 'school_admin',]), eventController.updateEvent);
router.delete('/:id',(['super_admin', 'school_super_admin', 'school_admin',]), eventController.deleteEvent);

module.exports = router;
