const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

const fetchUser = async(req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;
    console.log("Authorization Header:", authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized - Missing Authorization header" });
    }

    if (authHeader.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else {
        return res.status(401).json({ error: "Unauthorized - Invalid Authorization header format" });
    }

    try {
        console.log("Verifying token...");
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token verified:", data);

        if (!data) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(data.userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "USER NOT FOUND" });
        }

        console.log("User found:", user); // Log the entire user object

        req.user = user;
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

module.exports = fetchUser;