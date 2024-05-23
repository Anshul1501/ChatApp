const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema({

    //participants array
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: [],
    }]

    //on frontend will do: createdAt, updatedAt => message.createdAt
}, { timestamps: true });

const Conversation = mongoose.model("Conversation", ConversationSchema);
module.exports = Conversation;