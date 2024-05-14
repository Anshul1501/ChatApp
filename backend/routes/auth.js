const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");
const generateTokenAndSetCookie = require("../utils/generateToken");

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
            //   const maleProfilePicture = `https://avatar.iran.liara.run/public/boy?userName=${userName}`;
            //  const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl?userName=${userName}`;

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
            const token = generateTokenAndSetCookie(user._id, res);

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
        body("loginIdentifier", "Enter a valid Email or Username").exists(),
        body("password", "Password must be at least 5 characters").exists(),
    ],
    async(req, res) => {
        // Handling POST request to "/api/auth/login" endpoint
        try {
            let success = false;
            // Validate request body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Destructure loginIdentifier (email or username) and password from body
            const { loginIdentifier, password } = req.body;
            let foundUser;

            // Check if the loginIdentifier is an email
            if (validator.isEmail(loginIdentifier)) {
                foundUser = await User.findOne({ email: loginIdentifier });
            } else {
                // If not an email, assume it's a username
                foundUser = await User.findOne({ userName: loginIdentifier });
            }

            if (!foundUser) {
                //  success = false;
                return res
                    .status(400)
                    .json({
                        success,
                        error: "Please try to login with correct credentials",
                    });
            }

            // Compare the provided password with the hashed password from the database
            const passwordCompare = await bcrypt.compare(
                password,
                foundUser.password
            );
            if (!passwordCompare) {
                // success = false;
                return res
                    .status(400)
                    .json({
                        success,
                        error: "Please try to login with correct credentials",
                    });
            }

            // If user exists in database and password matches, generate and return the jwt token
            // Generate JWT token
            const token = generateTokenAndSetCookie(foundUser._id, res);

            // Send JWT token in response
            success = true;
            res.json({ success, token });
            // console.log(token);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error");
        }
    }
);

//ROUTE 3: Logout "/api/auth/logout"

router.post("/logout", [], async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out succesfully" })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;