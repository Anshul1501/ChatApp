const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const { app, server } = require("./socket/socket");
dotenv.config();

connectToMongo();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/users", require("./routes/userRoutes"));

server.listen(port, () => {
    console.log(`chatApp backend listening on port ${port}`);
});