const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/usersmodels");
const jwt = require("jsonwebtoken");

// Register user
// Route POST /api/user/register
// Access public
const registerUser = asyncHandler(async (req, res) => {
    console.log("Registration started");

    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        console.log("Validation failed");
        throw new Error("All fields are mandatory");
    }

    // Check if user already exists
    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        console.log("User already exists");
        throw new Error("User already registered, try a different email");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Create new user
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });

    console.log("User created:", user);


    if (user) {
        console.log("User created successfully");
        res.status(201).json({
            message: "Account created successfully",
            _id: user.id,
            username: user.username,
            email: user.email,
            success: true,
        });
    } else {
        console.log("User creation failed");
        throw new Error("User creation failed, data is not valid");
    }
});


// Login user
// Route POST /api/user/login
// Access public
// Login user
// Route POST /api/user/login
// Access public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Log the incoming request body
    console.log("Request Body:", req.body);

    // Validate input fields
    if (!email || !password) {
        res.status(400);
        console.log("Validation Error: All fields are mandatory");
        throw new Error("All fields are mandatory");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create JWT token
        const accessToken = jwt.sign(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    profilePicture: user.profilePicture
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }  // Token expires in 1 hour
        );
        
        // Populate user posts
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post && post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        );
        
        // Construct user object
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts.filter(post => post !== null) // filter out null posts
        };

        // Send success response with token and user data
        return res.status(200).json({
            message: "Login successful",
            user: userResponse,
            accessToken // Include the token in the response
        });
    } else {
        res.status(401);
        console.log("Login Error: Invalid email or password");
        throw new Error("Invalid email or password");
    }
});


const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Clear the token from the client side
        res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while logging out",
            success: false
        });
    }
});




const getProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

const editProfile = async (req, res) => {
    try {
        const userId = req.params.id;  // Get the userId from the URL params
        const { bio } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        }

        if (bio) user.bio = bio;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save(); // Update user profile

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error.',
            success: false
        });
    }
};

const suggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};
 const followOrUnfollow = async (req, res) => {
    try {
        const follow = req.id; 
        const tobefollow = req.params.id; 
        if (follow === tobefollow) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(follow);
        const targetUser = await User.findById(tobefollow);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(tobefollow);
        if (isFollowing) {
            // unfollow logic 
            await Promise.all([
                User.updateOne({ _id: follow }, { $pull: { following: tobefollow } }),
                User.updateOne({ _id: tobefollow }, { $pull: { followers: follow } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: follow }, { $push: { following: tobefollow} }),
                User.updateOne({ _id: tobefollow }, { $push: { followers: follow } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getProfile,
    editProfile,
    suggestedUsers,
    followOrUnfollow
};
