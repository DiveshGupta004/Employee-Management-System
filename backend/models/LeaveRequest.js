const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Employee = require("./Employee"); // Import Employee model
const LeaveType = require("./LeaveType"); // Import LeaveType model

const LeaveRequest = sequelize.define(
  "LeaveRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Employee", key: "id" },
      onDelete: 'CASCADE'
    },
    leaveTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "LeaveType", key: "id" }, // Reference to LeaveType model
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "LeaveRequest", // Explicit table name
    timestamps: false, // No createdAt and updatedAt fields
  }
);

// 🔹 Establish associations
LeaveRequest.belongsTo(Employee, { foreignKey: "employeeId" });
LeaveRequest.belongsTo(LeaveType, { foreignKey: "leaveTypeId" }); // Add this line to link to LeaveType

Employee.hasMany(LeaveRequest, { foreignKey: "employeeId" });
LeaveType.hasMany(LeaveRequest, { foreignKey: "leaveTypeId" }); // Add this line to link to LeaveType

module.exports = LeaveRequest;
