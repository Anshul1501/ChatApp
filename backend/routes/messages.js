const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages");
const fetchUser = require("../middleware/fetchUser");
const { getReceiverSocketId } = require("../socket/socket");

// Route 1: Send messages POST : "api/message/send/:id". LOGIN REQUIRED
router.post("/send/:id", fetchUser, async(req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!senderId) {
            return res.status(400).json({ error: "Sender ID is missing" });
        }

        console.log(`Sender ID: ${senderId}, Receiver ID: ${receiverId}`);

        let conversation = await Conversation.findOne({
            participants: { $all: [receiverId, senderId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [receiverId, senderId],
            });
        }

        const newMessage = new Messages({
            receiverId,
            senderId,
            message,
        });

        conversation.messages.push(newMessage._id);

        // await conversation.save();
        // await newMessage.save();
        // this will run in parallel
        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Route 2: Get messages GET: "api/messages/:id". LOGIN REQUIRED
router.get("/get/:id", fetchUser, async(req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [userToChatId, senderId] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;