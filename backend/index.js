require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const sequelize = require("./config");

// Import Routes
const authRoutes = require("./routes/adminRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const designationRoutes = require("./routes/designationRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser()); // ✅ Parse cookies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ Sync Database
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


app.get('/api/auth/validate', (req, res) => {
  if (req.cookies.auth_token) {
    // Verify the token and return success if valid
    return res.status(200).json({ isAuthenticated: true });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.cookie('auth_token', '', { expires: new Date(0) });  // Clear the auth_token cookie
  res.status(200).json({ message: 'Logged out successfully' });
});


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
