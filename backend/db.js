const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
async function connectToMongo() {
    await mongoose
        .connect(process.env.MONGO_DB_URI)
        .then(() => console.log("Connected to Mongo Successfully"))
        .catch((err) => console.log(err));
}

module.exports = connectToMongo;