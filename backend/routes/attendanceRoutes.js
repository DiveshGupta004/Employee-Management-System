const express = require("express");
const router = express.Router();
const { checkIn, checkOut , markDailyStatus } = require("../controllers/attendanceController");
const { authenticateEmployee } = require("../middleware/adminMiddleware");

router.post("/checkin", authenticateEmployee, checkIn);
router.post("/checkout", authenticateEmployee, checkOut);
router.post("/mark-daily",markDailyStatus); // run this as daily cron or manually

module.exports = router;
