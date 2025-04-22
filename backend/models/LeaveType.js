const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const LeaveType = sequelize.define(
  "LeaveType",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure types are unique
    },
  },
  {
    tableName: "LeaveType", // Explicit table name
    timestamps: false, // No createdAt and updatedAt fields
  }
);

module.exports = LeaveType;
