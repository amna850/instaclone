const Message = require('../models/messagesmodel');
const asyncHandler = require('express-async-handler');

// Send a new message
const sendMessage = asyncHandler(async (req, res) => {
    const { recieverId, message } = req.body;
    const senderId = req.user._id;

    if (!recieverId || !message) {
        res.status(400);
        throw new Error('Recipient and message content are required');
    }

    const newMessage = await Message.create({
        senderId,
        recieverId,
        message,
    });

    return res.status(201).json({
        success: true,
        message: 'Message sent',
        data: newMessage
    });
});

// Get all messages between two users
const getMessagesBetweenUsers = asyncHandler(async (req, res) => {
    const senderId = req.user._id; // Assuming the logged-in user is one of the participants
    const { recieverId } = req.params;

    if (!recieverId) {
        res.status(400);
        throw new Error('Recipient ID is required');
    }

    const messages = await Message.find({
        $or: [
            { senderId, recieverId },
            { senderId: recieverId, recieverId: senderId }
        ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({
        success: true,
        messages
    });
});

// Mark messages as read
 const markMessagesAsRead = asyncHandler(async (req, res) => {
    const senderId = req.params.senderId; // The user who sent the messages
    const recieverId = req.user._id; // The current logged-in user is the recipient

    await Message.updateMany(
        { senderId, recieverId, read: false },
        { $set: { read: true } }
    );

    return res.status(200).json({
        success: true,
        message: 'Messages marked as read'
    });
});
module.exports = {
    sendMessage,
    getMessagesBetweenUsers,
    markMessagesAsRead

};