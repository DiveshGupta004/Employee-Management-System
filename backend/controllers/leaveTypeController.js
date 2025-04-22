const LeaveType = require("../models/LeaveType");

// ✅ Create a Leave Type (Admin)
exports.createLeaveType = async (req, res) => {
  try {
    const { type } = req.body;

    // Check if the leave type already exists
    const existingLeaveType = await LeaveType.findOne({ where: { type } });
    if (existingLeaveType) {
      return res.status(400).json({ message: "Leave type already exists" });
    }

    // Create the new leave type
    const leaveType = await LeaveType.create({ type });
    res.status(201).json({ message: "Leave type created successfully", leaveType });
  } catch (error) {
    res.status(500).json({ message: "Error creating leave type", error });
  }
};

// ✅ Get All Leave Types (Anyone)
exports.getAllLeaveTypes = async (req, res) => {
  try {
    const leaveTypes = await LeaveType.findAll();
    res.status(200).json(leaveTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave types", error });
  }
};

// ✅ Get a Single Leave Type by ID (Anyone)
exports.getLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find leave type by ID
    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    res.status(200).json(leaveType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave type", error });
  }
};

// ✅ Update a Leave Type (Admin)
exports.updateLeaveType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    // Find leave type by ID
    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    // Update the leave type
    leaveType.type = type;
    await leaveType.save();

    res.status(200).json({ message: "Leave type updated successfully", leaveType });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave type", error });
  }
};

// ✅ Delete a Leave Type (Admin)
exports.deleteLeaveType = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the leave type by ID
    const leaveType = await LeaveType.findByPk(id);
    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    // Delete the leave type
    await leaveType.destroy();

    res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave type", error });
  }
};
