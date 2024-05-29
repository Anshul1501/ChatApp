const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log("A user connected", socket.id);

    // Listen for the disconnect event
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
    });

    // Additional event listeners can be added here
    // e.g., socket.on('chat message', (msg) => { ... });
});

module.exports = { app, server };