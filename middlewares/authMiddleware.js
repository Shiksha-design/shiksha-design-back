const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };  // Only attach necessary user data
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };