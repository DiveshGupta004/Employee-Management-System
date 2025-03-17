const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Employee = require("./Employee"); // Import Employee model

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
    },
    leaveType: {
      type: DataTypes.ENUM("Sick", "Casual", "Paid", "Unpaid"),
      allowNull: false,
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

// 🔹 Establish association with Employee
LeaveRequest.belongsTo(Employee, { foreignKey: "employeeId" });
Employee.hasMany(LeaveRequest, { foreignKey: "employeeId" });

module.exports = LeaveRequest;
