const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// Middleware to Authenticate User
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        req.user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

// Get User Info Route (Protected)
router.get("/info", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
