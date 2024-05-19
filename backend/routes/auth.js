const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");
const generateTokenAndSetCookie = require("../utils/generateToken");

// Router 1: Create new account using POST: "/api/auth/singup". Logging not required
router.post(
    "/signup", [
        // Validation middleware for request body
        body("fullName", "Full name must be at least 3 characters long").isLength({ min: 3 }),
        body("username", "username must be at least 3 characters").isLength({ min: 3 }),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
        body("gender", "Enter a valid gender").isIn(["male", "female"]),
    ],
    async(req, res) => {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            //  // Check if passwords match
            //  if (req.body.password !== req.body.confirmPassword) {
            //      return res.status(400).json({ error: "Passwords do not match" });
            //  }

            // Check if user with the given username already exists
            let user = await User.findOne({ username: req.body.username });
            if (user) {
                console.log('User already exists:', user);
                return res.status(400).json({ error: "User already exists" });
            }

            // Hash password with bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${req.body.username}`;
            const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${req.body.username}`;

            // Create new user
            user = new User({
                fullName: req.body.fullName,
                username: req.body.username,
                password: hashedPassword,
                gender: req.body.gender,
                profilePic: req.body.gender === "male" ? boyProfilePic : girlProfilePic,
            });

            await user.save();

            // Generate JWT token
            generateTokenAndSetCookie(user._id, res, (token) => {
                console.log(token);
                // Send JWT token in response
                res.json({ token });
            });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);


// Router 2: Authenticate user "/api/auth/login".
router.post(
    "/login", [
        // Validation middleware for request body
        body("loginIdentifier", "Enter a valid username").exists(),
        body("password", "Password must be at least 6 characters").exists(),
    ],
    async(req, res) => {
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Destructure loginIdentifier (username) and password from body
            const { loginIdentifier, password } = req.body;

            // Check if the loginIdentifier is a username
            const foundUser = await User.findOne({ username: loginIdentifier });

            // Check if user exists and password matches
            if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
                return res.status(400).json({ error: "Invalid credentials" });
            }

            // Generate JWT token
            generateTokenAndSetCookie(foundUser._id, res, (token) => {
                console.log(token);
                // Send JWT token in response
                res.json({ success: true, token });
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// ROUTE 3: Logout "/api/auth/logout"
router.post("/logout", [], async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;