const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

//Get user from sidebar using GET: "/api/users". Login required
router.get("/", fetchUser, async(req, res) => {

    try {
        //sidebar information of user: user_id, userName & profilePicture
        const loggedInUserId = req.user._id;

        //find all the users in the database but not the user with this loggedin id 
        const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json({ allUsers })

    } catch (error) {
        console.log("Error in getUserForSidebar", error.message)
        res.status(500).json({ error: "Interal server error" });
    }
})

module.exports = router;