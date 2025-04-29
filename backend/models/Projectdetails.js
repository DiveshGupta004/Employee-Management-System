const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const ProjectDetails = sequelize.define('ProjectDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    projectName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Planned', 'Ongoing', 'Completed'),
        defaultValue: 'Planned'
    }
}, {
    tableName: 'ProjectDetails',
    timestamps: false
});

module.exports = ProjectDetails;
