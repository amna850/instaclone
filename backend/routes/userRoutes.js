const express = require("express");
const { editProfile, followOrUnfollow, getProfile, suggestedUsers, loginUser, logoutUser, registerUser } = require("../controllers/userController");
const isAuthenticated = require("../middleware/validateTokenHandler");
const router = express.Router();
const upload = require("../middleware/multer");


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser); 
router.get("/profile/:id", isAuthenticated,getProfile);  
router.post("/profile/edit/:id",isAuthenticated, upload.single("profilePicture"), editProfile);
router.get("/suggested", isAuthenticated,suggestedUsers); 
router.post("/follow/:id", isAuthenticated,followOrUnfollow);


module.exports = router;
