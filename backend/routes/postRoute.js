const express = require("express");
const isAuthenticated= require( "../middleware/validateTokenHandler.js");
const { addComment, addPost, bookmarkPost, deletePost, getAllPost, getCommentsOfPost, getUserPost, likePost } = require( "../controllers/postController.js");
const upload = require("../middleware/multer");
const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single('image'), addPost);
router.route("/all").get(isAuthenticated,getAllPost);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/comment").post(isAuthenticated, addComment); 
router.route("/:id/comment/all").post(isAuthenticated, getCommentsOfPost);
router.route("/delete/:id").delete(isAuthenticated, deletePost);
router.route("/:id/bookmark").get(isAuthenticated, bookmarkPost);

module.exports = router;
