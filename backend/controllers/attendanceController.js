// attendanceController.js
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");
const dayjs = require("dayjs");
const OFFICE_LAT = 28.6139;
const OFFICE_LNG = 77.2090;
const ALLOWED_RADIUS = 100;
const CHECKIN_START = 9; // 9 AM
const CHECKOUT_END = 17; // 5 PM
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.checkIn = async (req, res) => {
  const { latitude, longitude } = req.body;
  const userId = req.employee.id;
  const today = new Date().toISOString().split("T")[0];

  // Check if leave is approved for today
  const leave = await LeaveRequest.findOne({
    where: {
      employeeId: userId,
      status: "Approved",
      startDate: { [Op.lte]: today },
      endDate: { [Op.gte]: today },
    },
  });
  if (leave) return res.status(403).json({ error: "You are on leave today." });

  const distance = getDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
  if (distance > ALLOWED_RADIUS) {
    return res.status(403).json({ error: "Not within allowed location." });
  }

  const already = await Attendance.findOne({ where: { employeeId: userId, date: today } });
  if (already) return res.status(400).json({ error: "Already checked in today" });

  const now = new Date();
  const checkinHour = now.getHours();
  const status = checkinHour > CHECKIN_START ? "Late" : "Present";

  const record = await Attendance.create({
    employeeId: userId,
    date: today,
    checkInTime: now,
    status
  });

  res.json({ message: "Check-in successful", record });
};

exports.checkOut = async (req, res) => {
    const userId = req.employee.id;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    const checkoutHour = now.getHours();
  
    const record = await Attendance.findOne({ where: { employeeId: userId, date: today } });
    if (!record) return res.status(404).json({ error: "No check-in record found." });
  
    record.checkOutTime = now;
  
    if (checkoutHour < CHECKOUT_END && record.status !== "Leave") {
      record.status = "Early";
    }
  
    await record.save();
  
    res.json({ message: "Check-out successful", record });
  };

// Get logged-in employee's attendance
exports.getMyAttendance = async (req, res) => {
  const userId = req.employee.id;
  const records = await Attendance.findAll({
    where: { employeeId: userId },
    order: [['date', 'DESC']]
  });
  res.json({ records });
};

// Admin: Get all employees' attendance
exports.getAllAttendance = async (req, res) => {
  const records = await Attendance.findAll({ order: [['date', 'DESC']] });
  res.json({ records });
};


exports.markDailyStatus = async (req, res) => {
    const today = new Date().toISOString().split("T")[0];
    const employees = await Employee.findAll({ where: { status: "Active" } });
  
    const promises = employees.map(async (emp) => {
      const alreadyMarked = await Attendance.findOne({ where: { employeeId: emp.id, date: today } });
      if (alreadyMarked) return;
  
      const approvedLeave = await LeaveRequest.findOne({
        where: {
          employeeId: emp.id,
          status: "Approved",
          [Op.and]: [
            { startDate: { [Op.lte]: today } },
            { endDate: { [Op.gte]: today } }
          ]
        }
      });
  
      await Attendance.create({
        employeeId: emp.id,
        date: today,
        status: approvedLeave ? "Leave" : "Absent"
      });
    });
  
    await Promise.all(promises); // run in parallel
    res.json({ message: "✅ Daily attendance marked for all." });
  };
  

  // Get Attendance Summary for a specific month
  exports.getMyAttendanceSummary = async (req, res) => {
    const userId = req.employee.id;
    const { month } = req.query;
  
    const selectedMonth = dayjs(month || dayjs().format("YYYY-MM"));
    const monthStart = selectedMonth.startOf("month");
    const monthEnd = selectedMonth.endOf("month");
  
    // Generate all weekdays excluding Sundays
    const workingDays = [];
    let currentDay = monthStart;
  
    while (currentDay.isSameOrBefore(monthEnd, "day")) {
      if (currentDay.day() !== 0) { // day() === 0 means Sunday
        workingDays.push(currentDay.format("YYYY-MM-DD"));
      }
      currentDay = currentDay.add(1, "day");
    }
  
    try {
      const records = await Attendance.findAll({
        where: {
          employeeId: userId,
          date: {
            [Op.between]: [monthStart.format("YYYY-MM-DD"), monthEnd.format("YYYY-MM-DD")],
          },
        },
      });
  
      const present = records.filter((r) => r.status === "Present").length;
      const late = records.filter((r) => r.status === "Late").length;
      const absent = records.filter((r) => r.status === "Absent").length;
  
      const totalWorkingDays = workingDays.length;
      const attendedDays = present + late;
  
      const percent = totalWorkingDays === 0 ? 0 : Math.round((attendedDays / totalWorkingDays) * 100);
  
      res.json({ present, late, absent, total: totalWorkingDays, percent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load attendance summary" });
    }
  };

// Get Attendance Logs for a specific month
exports.getMyAttendanceLogs = async (req, res) => {
  const userId = req.employee.id;
  const { month } = req.query;

  // Calculate start and end of the month
  const monthStart = dayjs(month || dayjs().format("YYYY-MM"))
    .startOf("month")
    .format("YYYY-MM-DD");
  const monthEnd = dayjs(month || dayjs().format("YYYY-MM"))
    .endOf("month")
    .format("YYYY-MM-DD");

  try {
    const records = await Attendance.findAll({
      where: {
        employeeId: userId,
        date: {
          [Op.between]: [monthStart, monthEnd],
        },
      },
      order: [["date", "ASC"]],
    });

    res.json({ records });
  } catch (err) {
    console.error("Error fetching attendance logs:", err);
    res.status(500).json({ message: "Failed to load attendance logs" });
  }
};

exports.getFilteredAttendanceLogs = async (req, res) => {
  const { employeeId, status, month } = req.query;
  const monthStart = dayjs(month || dayjs()).startOf("month").format("YYYY-MM-DD");
  const monthEnd = dayjs(month || dayjs()).endOf("month").format("YYYY-MM-DD");

  const where = {
    date: { [Op.between]: [monthStart, monthEnd] },
  };

  if (employeeId) where.employeeId = employeeId;
  if (status) where.status = status;

  try {
    const records = await Attendance.findAll({
      where,
      include: [{ model: Employee, attributes: ["id", "name"] }],
      order: [["date", "ASC"]],
    });
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch filtered logs" });
  }
};
