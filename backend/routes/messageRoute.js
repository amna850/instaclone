const express = require('express');
const { sendMessage, getMessagesBetweenUsers, markMessagesAsRead } = require('../controllers/messageController');
const isAuthenticated= require( "../middleware/validateTokenHandler.js");
const router = express.Router();

router.post('/send', isAuthenticated, sendMessage); // To send a message
router.get('/:recieverId', isAuthenticated, getMessagesBetweenUsers); // To get all messages between two users
router.put('/mark-read/:senderId', isAuthenticated, markMessagesAsRead); // To mark messages as read

module.exports = router;
