require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config');

// Import Routes
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const designationRoutes = require('./routes/designationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/designations', designationRoutes);



// Use Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);

// Sync Database
sequelize.sync({ force: false })  // Set to true to drop & recreate tables
  .then(() => console.log("Database connected!"))
  .catch(err => console.log("Error: " + err));

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
