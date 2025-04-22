const express = require("express");
const leaveController = require("../controllers/leaveController");
const { authenticateAdmin , authenticateEmployee } = require("../middleware/adminMiddleware");

const router = express.Router();

// ✅ Employee submits a leave request
router.post("/", leaveController.requestLeave);

// ✅ Admin-only routes
router.get("/",leaveController.getAllLeaveRequests);
router.get("/allleaves",authenticateEmployee , leaveController.getLeaveRequestsByEmployeeId);
router.get("/:id", leaveController.getLeaveRequestById);
router.put("/:id/approve", leaveController.approveLeave);
router.put("/:id/reject", leaveController.rejectLeave);
router.delete("/:id", leaveController.deleteLeaveRequest);

module.exports = router;
