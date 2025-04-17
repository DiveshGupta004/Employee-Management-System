const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const TypeEvent = sequelize.define('TypeEvent', {
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
    // tableName: 'event_types',  // Explicit table name
    timestamps: false
});

module.exports = TypeEvent;
