const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const isAuthenticated = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1]; // Extract the token

        // Verify the token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "User is not authorized" });
            }
            req.user = decoded.user; // Store user data in request
            next(); // Proceed to next middleware or route handler
        });
    } else {
        return res.status(401).json({ message: "Not authorized or token is missing" });
    }
});

module.exports = isAuthenticated;
