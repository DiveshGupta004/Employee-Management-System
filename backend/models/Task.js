// const { DataTypes } = require('sequelize');
// const sequelize = require('../config');
// const Employee = require('./Employee');

// const Task = sequelize.define('Task', {
//   id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   title: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: DataTypes.TEXT,
//   },
//   assignedTo: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Employee,
//       key: 'id',
//     },
//     allowNull: false,
//   },
//   status: {
//     type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
//     defaultValue: 'Pending',
//   },
//   progress: {
//     type: DataTypes.INTEGER, // Progress percentage
//     defaultValue: 0,
//     validate: {
//       min: 0,
//       max: 100,
//     },
//   },
//   deadline: {
//     type: DataTypes.DATE,
//     allowNull: false,
//   },
// }, {
//   tableName: 'Task',
//   timestamps: true,
// });

// module.exports = Task;
