const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Department = sequelize.define('Department', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'Department',  
    timestamps: false
});

module.exports = Department;
