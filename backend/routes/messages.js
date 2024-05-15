const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Messages = require("../models/Messages")
const validator = require("validator");
const fetchUser = require("../middleware/fetchUser");

//route 1: send messages POST : "api/message/send". LOGIN REQUIRED

router.post("/send/:id", fetchUser, async(req, res) => {

    try {

        const { message } = req.body; //getting message from user
        const { id: receiverId } = req.params; //recever id from params
        const { senderId } = req.user ? req.user._id : null;

        //find the conversation between these two sender and receiver 
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }, //this is a moongoose syntax 
        })

        //if conversation is not there then create one
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        //create the message coming from the user
        const newMessage = new Messages({
            senderId,
            receiverId,
            message,
        })

        //if conversation is successfully created, then push message._id in the array
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;