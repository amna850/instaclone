const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: [true, "Sender is required"],
    },
    recieverId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: [true, "Recipient is required"],
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
    },
    read: {
      type: Boolean,
      default: false, // Indicates if the message has been read
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

module.exports = mongoose.model("Message", messageSchema);
