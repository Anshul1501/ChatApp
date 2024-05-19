const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({

    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        required: false,
        enum: ['male', 'female'],
    },

    profilePic: {
        type: String,
        default: " ",
    }

}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;