const path = require('path');
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const { app, server } = require("./socket/socket");
dotenv.config();

connectToMongo();

const port = process.env.PORT || 5000;

__dirname = path.resolve();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(express.static(path.join(__dirname, "/frontend/dist")))

//any route other then above 

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/dist/index.html"))
})

server.listen(port, () => {
    console.log(`chatApp server backend listening on port ${port}`);
});