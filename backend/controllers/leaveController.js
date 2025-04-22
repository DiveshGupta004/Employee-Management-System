const LeaveRequest = require("../models/LeaveRequest");
const Employee = require("../models/Employee");

// ✅ Submit a Leave Request (Employee)
exports.requestLeave = async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;

    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leave = await LeaveRequest.create({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "Pending", // Default status
    });

    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (error) {
    res.status(500).json({ message: "Error submitting leave request", error });
  }
};

// ✅ Get All Leave Requests (Admin)
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await LeaveRequest.findAll({
      include: { model: Employee, attributes: ["name", "email"] }, // Join with Employee table
      order: [["id", "DESC"]],
    });

    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};

// ✅ Get a Single Leave Request by ID (Admin)
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await LeaveRequest.findByPk(id, {
      include: { model: Employee, attributes: ["name", "email"] },
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave request", error });
  }
};

// ✅ Approve Leave Request (Admin)
exports.approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = "Approved";
    await leave.save();

    res.status(200).json({ message: "Leave request approved", leave });
  } catch (error) {
    res.status(500).json({ message: "Error approving leave request", error });
  }
};

// ✅ Reject Leave Request (Admin)
exports.rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the leave request by ID
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // ✅ Update status to "Rejected"
    await leave.update({ status: "Rejected" });

    res.status(200).json({ message: "Leave request rejected", leave });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting leave request", error });
  }
};
// ✅ Delete a Leave Request (Admin)
exports.deleteLeaveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the leave request by ID
    const leave = await LeaveRequest.findByPk(id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Delete the leave request
    await leave.destroy();

    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave request", error });
  }
};


// ✅ Get Leave Requests by Employee ID (Employee)
exports.getLeaveRequestsByEmployeeId = async (req, res) => {
  try {
    const employeeId = req.employee.id; // from token, NOT req.params

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const leaveRequests = await LeaveRequest.findAll({
      where: { employeeId },
      include: { model: Employee, attributes: ["name", "email"] },
      order: [["id", "DESC"]],
    });

    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};



