const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      default:''
    },
    image: {
      type: String,
      required:[true, "you have to add image to post"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, "Post must have an author"],
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References to users who liked the post
    }],
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment', // Reference to a Comment model
    }],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Post", postSchema);
