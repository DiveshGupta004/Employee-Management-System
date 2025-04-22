const { DataTypes } = require("sequelize");
const sequelize = require("../config");
const Employee = require("./Employee");

const Attendance = sequelize.define("Attendance", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: "Employee", key: "id" },
    onDelete: "CASCADE"
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkInTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  checkOutTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("Present", "Absent", "Late" , "Leave" , "Early"),
    defaultValue: "Present"
  }
}, {
  tableName: "Attendance",
  timestamps: false
});

// Define relationship
Attendance.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });
Employee.hasMany(Attendance, { foreignKey: "employeeId", as: "attendances" });

module.exports = Attendance;
