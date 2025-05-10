const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyAuthToken = async (req, res, next) => {
  try {
    const token = req.cookies.auth_token;
    // console.log("🔥 Token received in cookie:", token);

    if (!token) {
      console.log("⛔ No token provided in cookie");
      return res
        .status(401)
        .json({ message: "No token provided, unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("✅ Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password");
    // console.log("👤 User fetched from DB:", user);

    if (!user) {
      console.log("⛔ User not found in database");
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ message: "Invalid token." });
  }
};

module.exports = { verifyAuthToken };
