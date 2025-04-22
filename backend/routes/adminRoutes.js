const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
// const authController = require("../controllers/authController"); // unified login
const jwt = require("jsonwebtoken");

// ✅ Admin-only routes
router.post("/register", adminController.register);
router.post("/forgot-password", adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);

// ✅ Unified login for Admin & Employee
router.post("/login", adminController.login);

// ✅ Validate user and return role
router.get("/validate", (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) return res.json({ isAuthenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      isAuthenticated: true,
      isAdmin: decoded.isAdmin,
      id: decoded.id,
      username: decoded.username || null,
      email: decoded.email || null
    });
  } catch (err) {
    res.status(401).json({ isAuthenticated: false });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
