const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatControllers');

// One-on-One & Group Chat
router.post('/send-message', chatController.createPrivateChannel);
router.post('/create-group', chatController.createGroupChannel);
router.post('/save-message', chatController.saveMessage);
// Call Notifications
router.post('/save-call', chatController.saveCall);
router.post('/notify-call', chatController.notifyCall);
router.get('/message-history', chatController.getMessageHistory);

// Call Logging
// router.post('/log-call', chatController.logCall);
router.get('/call-history/:userId', chatController.getCallHistory);

// Stream Webhook Handler
router.post('/webhook/stream', chatController.streamWebhookHandler);

module.exports = router;