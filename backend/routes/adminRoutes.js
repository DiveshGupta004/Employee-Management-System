const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateAdmin } = require("../middleware/adminMiddleware"); // ✅ Correct import

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
});

router.post('/logout', (req, res) => {
    res.cookie('auth_token', '', { expires: new Date(0) });  // Clear the auth_token cookie
    res.status(200).json({ message: 'Logged out successfully' });
  });
module.exports = router;
