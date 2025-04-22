const express = require("express");
const employeeController = require("../controllers/employeeController");
const { authenticateAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();


router.post("/login", employeeController.login);

// Admin-only routes
router.post("/", authenticateAdmin, employeeController.createEmployee);
router.get("/", authenticateAdmin, employeeController.getAllEmployees);
router.get("/:id", authenticateAdmin, employeeController.getEmployeeById);
router.put("/:id", authenticateAdmin, employeeController.updateEmployee);
router.delete("/:id", authenticateAdmin, employeeController.deleteEmployee);
router.post("/login" , employeeController.login);
module.exports = router;
