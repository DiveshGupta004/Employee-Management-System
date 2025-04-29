const express = require("express");
const router = express.Router();
const LeaveTypeController = require("../controllers/leaveTypeController");
const { authenticateAdmin, authenticateEmployee } = require('../middleware/adminMiddleware');

// Admin routes for leave type management
router.post("/", authenticateAdmin,  LeaveTypeController.createLeaveType); // Create a new leave type
router.get("/",  LeaveTypeController.getAllLeaveTypes); // Get all leave types
router.get("/:id", authenticateAdmin,  LeaveTypeController.getLeaveTypeById); // Get leave type by ID
router.put("/:id", authenticateAdmin,  LeaveTypeController.updateLeaveType); // Update leave type
router.delete("/:id", authenticateAdmin,  LeaveTypeController.deleteLeaveType); // Delete a leave type

module.exports = router;
