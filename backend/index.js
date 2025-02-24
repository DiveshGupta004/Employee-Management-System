require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./config");

// Import Routes
const authRoutes = require("./routes/adminRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const designationRoutes = require("./routes/designationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);

// Sync Database
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully.");
    return sequelize.sync({ force: false });
  })
  .then(() => {
    console.log("✅ Database synced successfully.");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
