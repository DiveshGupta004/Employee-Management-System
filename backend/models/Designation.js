const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Designation = sequelize.define('Designation', {
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
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1  // Ensuring level is at least 1
        }
    }
}, {
    tableName: 'Designation',  // Explicit table name
    timestamps: false
});

module.exports = Designation;
