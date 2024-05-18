const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages");
const fetchUser = require("../middleware/fetchUser");

// Route 1: Send messages POST : "api/message/send/:id". LOGIN REQUIRED
router.post("/send/:id", fetchUser, async(req, res) => {
    try {
        const { message } = req.body; // getting message from user
        const receiverId = req.user ? req.user._id : null; // receiver id from params
        const senderId = req.params.id; // corrected senderId assignment

        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is missing" });
        }

        console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}`);

        // Find the conversation between these two sender and receiver
        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] }, // this is a mongoose syntax
        });

        // If conversation is not there, then create one
        if (!conversation) {
            conversation = new Conversation({
                participants: [receiverId, senderId],
            });
        }

        // Create the message coming from the user
        const newMessage = new Messages({
            receiverId,
            senderId,
            message,
        });


        // if conversation is successfully created, then push message._id in the array

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        //to make the conversation real time adding SOCKET IO FUNCTIONALITY 

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

//ROUTE 2: get messages GET: "/api/messages/:id". LOGIN REQUIRED

router.get("/:id", fetchUser, async(req, res) => {
    try {
        const userToChatId = req.params.id; // user to whom we are chatting (receiver ID)
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