const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/adminMiddleware");

// ✅ Admin Authentication Routes
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/forgot-password", adminController.forgotPassword);
router.post("/reset-password", adminController.resetPassword);

router.get('/validate', (req, res) => {
    if (req.cookies.auth_token) {
      // Verify the token and return success if valid
      return res.status(200).json({ isAuthenticated: true });
    } else {
      return res.status(401).json({ isAuthenticated: false });
    }

    res.clearCookie("auth_token", { 
        httpOnly: true,   
        secure: false,   // ❌ Set to `false` for local testing (Change to `true` in production with HTTPS)
        sameSite: "Lax",
        path: "/"        
    });

    res.json({ message: "Logged out successfully" });
});



module.exports = router;
