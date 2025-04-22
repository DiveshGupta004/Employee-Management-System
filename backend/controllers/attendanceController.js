// attendanceController.js
const Attendance = require("../models/Attendance");
const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");
const { Op } = require("sequelize");

const OFFICE_LAT = 28.6139;
const OFFICE_LNG = 77.2090;
const ALLOWED_RADIUS = 100;
const CHECKIN_START = 9; // 9 AM
const CHECKOUT_END = 17; // 5 PM

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
    const employees = await Employee.findAll({ where: { status: 'Active' } });
  
    for (const emp of employees) {
      const alreadyMarked = await Attendance.findOne({ where: { employeeId: emp.id, date: today } });
      if (alreadyMarked) continue;
  
      const approvedLeave = await LeaveRequest.findOne({
        where: {
          employeeId: emp.id,
          status: "Approved",
          startDate: { [Op.lte]: today },
          endDate: { [Op.gte]: today },
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
    }
  
    res.json({ message: "Daily attendance marked." });
  };
  