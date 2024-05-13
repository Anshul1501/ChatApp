const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var JWT_SECRET = "anshul@1234dsf";

//Router 1: Create new account using POST: "/api/auth/singup". Loging not required

router.post(
    "/singup", [
        // Validation middleware for request body
        body("fullName", "Enter your full name").isLength({ min: 3 }),
        body("userName", "Username must be at least 3 characters"),
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password must be at least 5 characters").isLength({
            min: 5,
        }),
        body("gender", "Enter a valid gender").isIn(["male", "female"]),
        //  body("profilePic", "Enter a valid profile picture URL").isURL(),
    ],
    async(req, res) => {
        // Handling POST request to "/api/auth/Singup" endpoint
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if user with email already exists
            let user = await User.findOne({
                $or: [{ email: req.body.email }, { username: req.body.username }],
            });
            if (!user) {
                return res.status(400).json({ error: "User already exists" });
            }

            // Hash password with bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //avtar place holder if profile picture is not uploaded
            const maleProfilePicture = `https://avatar.iran.liara.run/public/boy`;
            const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl`;

            // Create new user
            user = new User({
                fullName: req.body.fullName,
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                gender: req.body.gender,
                /*
                        profilePic: req.body.profilePic ?
                       req.body.profilePic : req.body.gender === "male" ?
                       maleProfilePicture : femaleProfilePicture,
                */
            });
            await user.save();

            // Generate JWT token
            const payload = {
                user: {
                    id: user.id,
                },
            };
            const token = jwt.sign(payload, JWT_SECRET);

            // Send JWT token in response
            res.json({ token });
            console.log(token);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

// Router 2: authnticate user "/api/auth/login". 

router.post(
    "/login", [
        // Validation middleware for request body
        body("email", "Enter a valid Email").isEmail(),
        body("password", "Password must be at least 5 characters").isLength({
            min: 5,
        })
    ],
    async(req, res) => {
        // Handling POST request to "/api/auth/Singup" endpoint
        try {
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Check if user with email already exists
            let user = await User.findOne({
                $or: [{ email: req.body.email }, { username: req.body.username }],
            });
            if (!user) {
                return res.status(400).json({ error: "User already exists" });
            }

            // Hash password with bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //avtar place holder if profile picture is not uploaded
            const maleProfilePicture = `https://avatar.iran.liara.run/public/boy`;
            const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl`;

            // Create new user
            user = new User({
                fullName: req.body.fullName,
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                gender: req.body.gender,
                /*
                        profilePic: req.body.profilePic ?
                       req.body.profilePic : req.body.gender === "male" ?
                       maleProfilePicture : femaleProfilePicture,
                */
            });
            await user.save();

            // Generate JWT token
            const payload = {
                user: {
                    id: user.id,
                },
            };
            const token = jwt.sign(payload, JWT_SECRET);

            // Send JWT token in response
            res.json({ token });
            console.log(token);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;