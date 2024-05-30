const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // socket.on() is used to listen to the events. can be used both on client and server side
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("sendMessage", async(data) => {
        try {
            console.log("Message received:", data);

            // Validate incoming data
            if (!data.senderId || !data.receiverId || !data.message) {
                throw new Error('Missing required fields: senderId, receiverId, or message');
            }

            // Save the message to the database
            const newMessage = new Message({
                sender: data.senderId,
                receiver: data.receiverId,
                text: data.message,
            });

            await newMessage.save();

            console.log("Message saved:", newMessage);

            // Send the message to the receiver if they are online
            const receiverSocketId = getReceiverSocketId(data.receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", newMessage);
                console.log("Message sent to receiver:", data.receiverId);
            }

            // Respond back to the sender
            socket.emit("messageSent", newMessage);
            console.log("Message sent to sender:", newMessage);

        } catch (error) {
            console.error("Error handling sendMessage event:", error.message);
            socket.emit("error", { error: "Internal Server Error" });
        }
    });
});
module.exports = { app, server, getReceiverSocketId, io };