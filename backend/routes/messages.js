const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages");
const fetchUser = require("../middleware/fetchUser");

// Route 1: Send messages POST : "api/message/send/:id". LOGIN REQUIRED
router.post("/send/:id", fetchUser, async(req, res) => {
    try {
        const { message } = req.body; // Use content from request body
        const { id: receiverId } = req.params; // Receiver id from params
        const senderId = req.user._id; // Corrected senderId assignment

        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is missing" });
        }

        console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}`);

        // Find the conversation between sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] },
        });

        // If conversation does not exist, create one
        if (!conversation) {
            conversation = new Conversation({
                participants: [receiverId, senderId],
            });
        }

        // Create the message coming from the user
        const newMessage = new Messages({
            receiverId,
            senderId,
            message, // Use content instead of message
        });

        // Push message ID into the conversation's messages array
        conversation.messages.push(newMessage._id);

        // Save conversation and message
        await conversation.save();
        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

//ROUTE 2: get messages GET: "/api/messages/:id". LOGIN REQUIRED

router.get("/get/:id", fetchUser, async(req, res) => {
    try {
        const { id: userToChatId } = req.params; // user to whom we are chatting (receiver ID)
        const senderId = req.user ? req.user._id : null; // sender ID


        // Find the conversation between these two sender and receiver
        const conversation = await Conversation.findOne({
            participants: { $all: [userToChatId, senderId] } // this is a mongoose syntax
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server Error");
    }
});

module.exports = router;