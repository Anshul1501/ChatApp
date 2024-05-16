const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages");
const fetchUser = require("../middleware/fetchUser");

// Route 1: Send messages POST : "api/message/send". LOGIN REQUIRED
router.post("/send/:id", fetchUser, async(req, res) => {
    try {
        const { message } = req.body; // getting message from user
        const receiverId = req.user._id; // receiver id from params
        const senderId = req.user ? req.user._id : null; // corrected senderId assignment

        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is missing" });
        }

        // Find the conversation between these two sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }, // this is a mongoose syntax
        });

        // If conversation is not there, then create one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, receiverId],
            });
        }

        // Create the message coming from the user
        const newMessage = new Messages({
            senderId,
            receiverId,
            message,
        });


        // if conversation is successfully created, then push message._id in the array

        conversation.messages.push(newMessage._id);
        // await newMessage.save();
        // await conversation.save();

        //this will run in parallel 
        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;