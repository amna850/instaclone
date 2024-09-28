const asyncHandler = require("express-async-handler");
const Post = require("../models/postmodel.js");
const Comment = require("../models/commentmodel.js");
const cloudinary = require("../utilis/cloudinary");
const sharp = require("sharp");


const addPost = asyncHandler(async (req, res) => {
    const { caption } = req.body;
    const image = req.file;

    // Log received data
    console.log("Caption received:", caption);
    console.log("Image received:", image);

    // If no image provided, throw error
    if (!image) {
        return res.status(400).json({ message: "You need to add an image to post" });
    }

    try {
        // Optimize the image using sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        console.log("Optimized Image:", fileUri); // Log optimized image

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        console.log("Cloudinary response:", cloudResponse); // Log Cloudinary response

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: req.user.id
        });
        console.log("Post created:", post); // Log the created post

        const user = await User.findById(req.user.id);
        if (user) {
            console.log("User found:", user); // Log user found
            user.posts.push(post._id);
            await user.save();
            console.log("Post added to user:", user.posts); // Log updated user posts
        }

        await post.populate({ path: 'author', select: '-password' });
        console.log("Post with populated author:", post); // Log the populated post

        // Respond with success message and post
        return res.status(201).json({
            message: "Post added successfully",
            success: true,
            post
        });
    } catch (error) {
        console.error("Error adding post:", error); // Log any error
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
});

// Get All Posts
 const getAllPost = asyncHandler(async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'author', select: 'username profilePicture' })
        .populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });

    return res.status(200).json({
        posts,
        success: true
    });
});
//get user post
const getUserPost = asyncHandler(async (req, res) => {
    const authorId = req.id; // Retrieve the user ID from the request

    const posts = await Post.find({ author: authorId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'author',
            select: 'username profilePicture' // Corrected the select syntax
        })
        .populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'author',
                select: 'username profilePicture' // Corrected the select syntax
            }
        });

    return res.status(200).json({
        posts,
        success: true
    });
});

const likePost = asyncHandler(async (req, res) => {
    const likeUserId = req.user._id; // Assuming req.user._id contains the logged-in user's ID from token
    const postId = req.params.id; // Post ID from request parameters

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Like the post if not already liked (efficient handling of duplicates)
    await post.updateOne({ $addToSet: { likes: likeUserId  } });
    await post.save();

    // Find the user who liked the post
    const user = await User.findById(likeUserId ).select('username profilePicture');

    // Notify the post owner if the liker is not the same as the post owner
    const postOwnerId = post.author.toString();
    if (postOwnerId !== likeUserId .toString()) {
        const notification = {
            type: 'like',
            userId: likeUserId ,
            userDetails: user,
            postId,
            message: 'Your post was liked'
        };

    }

    return res.status(200).json({ 
        message: 'Post liked', 
        success: true });
});

 const addComment = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const commentUserId = req.user._id;
    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Text is required');
    }

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const comment = await Comment.create({
        text,
        author: commentUserId,
        post: postId
    });

    await comment.populate({
        path: 'author',
        select: "username profilePicture"
    });

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
        message: 'Comment Added',
        comment,
        success: true
    });
});

const getCommentsOfPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');
    if (!comments.length) {
        res.status(404);
        throw new Error('No comments found for this post');
    }

    return res.status(200).json({ success: true, comments });
});
const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const authorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    // Check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId.toString()) {
        res.status(403);
        throw new Error('Unauthorized');
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Remove the post ID from the user's post array
    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
        success: true,
        message: 'Post deleted'
    });
});

// Bookmark Post
 const bookmarkPost = asyncHandler(async (req, res) => {
    const postId = req.params.id;
    const authorId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
        res.status(404);
        throw new Error('Post not found');
    }

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
        // Already bookmarked -> remove from the bookmark
        await user.updateOne({ $pull: { bookmarks: post._id } });
        await user.save();
        return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
    } 
    else {
        // Bookmark the post
        await user.updateOne({ $addToSet: { bookmarks: post._id } });
        await user.save();
        return res.status(200).json({ 
            type: 'saved', 
            message: 'Post bookmarked', 
            success: true });
    }

});

module.exports = { 
    addPost,
    getAllPost,
    getUserPost,
    likePost,
    addComment,
    getCommentsOfPost,
    deletePost,
    bookmarkPost
};
