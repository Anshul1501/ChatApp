const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (userId, res, callback) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development"
    });

    // Invoke the callback with the token value
    if (callback) {
        callback(token);
    }
};

module.exports = generateTokenAndSetCookie;