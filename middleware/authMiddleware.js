// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Authorization Header:", authHeader);

    // Check if token is provided
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Find user and attach to req.user (without password)
    const user = await User.findById(decoded.id).select("-password");
    console.log("Authenticated User:", user);

    if (!user) {
      console.warn("User not found for ID:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authorizing user:", error);

    // Handle expired or invalid tokens explicitly
    if (error.name === "TokenExpiredError") {
      console.warn("Token expired for user");
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.warn("Invalid token provided");
      return res.status(401).json({ message: "Invalid token" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = protect;
