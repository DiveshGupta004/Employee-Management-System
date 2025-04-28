const express = require("express");
const router = express.Router();
const { checkIn, checkOut , markDailyStatus , getMyAttendance ,getMyAttendanceSummary,getFilteredAttendanceLogs ,getMyAttendanceLogs , getAllAttendance,exportAttendance} = require("../controllers/attendanceController");
const { authenticateEmployee , authenticateAdmin } = require("../middleware/adminMiddleware");

router.get("/my/summary", authenticateEmployee, getMyAttendanceSummary);
router.get("/all", authenticateAdmin, getAllAttendance);
router.get("/export", authenticateAdmin, exportAttendance);
router.get("/my/logs", authenticateEmployee,getMyAttendanceLogs);
router.get("/logs", authenticateAdmin,getFilteredAttendanceLogs);
router.post("/checkin", authenticateEmployee, checkIn);
router.post("/checkout", authenticateEmployee, checkOut);
router.get("/my" , authenticateEmployee , getMyAttendance);
router.post("/mark-daily",markDailyStatus); // run this as daily cron or manually


module.exports = router;
