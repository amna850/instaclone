const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add email"],
      unique: [true, "Email address already registered"],
    },

    username: {
      type: String,
      required: [true, "Please add username"],
    },
    password: {
      type: String,
      required: [true, "Please add user password"],
    },
    profilePicture: {
      type: String,
      default: '', // No need for required here if you have a default value
    },
    bio: {
      type: String,
      default: '', // No need for required here if you have a default value
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    following: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    }],
  },
  { timestamps: true }//created at(timr record)
);

module.exports = mongoose.model("User", userSchema);
