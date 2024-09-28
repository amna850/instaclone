const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    //handle between users 
    participants: [{
        type: mongoose.Schema.Types.ObjectId, // Array of User references
        ref: 'User',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId, // Array of Message references
        ref: 'Message'
    }],


}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
