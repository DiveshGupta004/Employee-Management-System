const express = require("express");
const leaveController = require("../controllers/leaveController");
const { authenticateAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ Employee submits a leave request
router.post("/", leaveController.requestLeave);

// ✅ Admin-only routes
router.get("/", authenticateAdmin, leaveController.getAllLeaveRequests);
router.get("/:id", authenticateAdmin, leaveController.getLeaveRequestById);
router.put("/:id/approve", authenticateAdmin, leaveController.approveLeave);
router.put("/:id/reject", authenticateAdmin, leaveController.rejectLeave);
router.delete("/:id", authenticateAdmin, leaveController.deleteLeaveRequest);


module.exports = router;
