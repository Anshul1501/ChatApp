const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({

    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", //sender ID will be from User model
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    //on frontend will do: createdAt, updatedAt => message.createdAt
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;