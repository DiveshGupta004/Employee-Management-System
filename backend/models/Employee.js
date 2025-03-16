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
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    departmentId: {
        type: DataTypes.INTEGER,
        references: { model: 'Department', key: 'id' },
        onDelete: 'CASCADE' // Ensures cascading delete
    },
    designationId: {
        type: DataTypes.INTEGER,
        references: { model: 'Designation', key: 'id' },
        onDelete: 'CASCADE' // Ensures cascading delete
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    joiningDate: {
        type: DataTypes.DATEONLY,
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
