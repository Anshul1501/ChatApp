var jwt = require("jsonwebtoken");
var JWT_SECRET = "anshul@1234dsf";

const fetchUser = (req, red, next) => {

    const token = req.header(("auth-token"));
    if (!token) {
        res.status(401).send({ error: "Please authenticate user using valid token" });
    }
    try {

        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();

    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" });
    }
}

module.exports = fetchUser;