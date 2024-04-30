const jwt = require('jsonwebtoken');
const secretKey="secretKey";
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: "Access denied. Token missing" });
    }

    jwt.verify(token,secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ msg: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
