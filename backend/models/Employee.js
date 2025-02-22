const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    },
    departmentId: {
        type: DataTypes.INTEGER,
        references: { model: 'Department', key: 'id' }
    },
    designationId: {
        type: DataTypes.INTEGER,
        references: { model: 'Designation', key: 'id' }
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    joiningDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        defaultValue: 'Active'
    }
}, {
    tableName: 'Employee',  // Explicit table name
    timestamps: false
});

module.exports = Employee;
