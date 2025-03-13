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
    }
}, {
    tableName: 'Department',  
    timestamps: false
});

module.exports = Department;
