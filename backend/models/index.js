const { Sequelize } = require("sequelize");
const sequelize = require("../config");

// Define Models
const Admin = require("./Admin");
const Employee = require("./Employee");
const Department = require("./Department");
const Designation = require("./Designation");

// Sync models
sequelize
  .sync()
  .then(() => console.log("✅ Models synced successfully."))
  .catch((err) => console.error("❌ Error syncing models:", err));


module.exports = {
  sequelize,
  Admin, 
  Employee,
  Department,
  Designation,
};
