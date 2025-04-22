const { Sequelize } = require("sequelize");
const sequelize = require("../config");

// Define Models
const Admin = require("./Admin");
const Employee = require("./Employee");
const Department = require("./Department");
const Designation = require("./Designation");
const TypeEvent = require('./TypeEvent');

// Sync models
sequelize
  .sync({ alter: false }) // change this to false in production
  .then(() => console.log("✅ Models synced successfully."))
  .catch((err) => console.error("❌ Error syncing models:", err));


module.exports = {
  sequelize,
  Admin, 
  Employee,
  Department,
  Designation,
  TypeEvent,
};
