const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/adminMiddleware");

// ✅ Admin Authentication Routes
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/forgot-password", adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);

// ✅ Verify JWT Token (for authentication checks)
router.get("/verify-token", authenticateAdmin, (req, res) => {
    res.json({ message: "Authenticated", user: req.admin });
});

// ✅ FIX: Add `/validate` route to match frontend request
router.get("/validate", authenticateAdmin, (req, res) => {
    res.json({ isAuthenticated: true, user: req.admin });
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
    if (!req.cookies?.auth_token) {
        return res.status(400).json({ error: "No active session" });
    }

    res.clearCookie("auth_token", { 
        httpOnly: true,   
        secure: false,   // ❌ Set to `true` in production with HTTPS
        sameSite: "Lax",
        path: "/"        
    });

    res.json({ message: "Logged out successfully" });
});

module.exports = router;
