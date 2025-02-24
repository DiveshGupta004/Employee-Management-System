const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { authenticateAdmin } = require("../middleware/adminMiddleware");


router.get("/", authenticateAdmin ,departmentController.getAllDepartments);
router.post("/", authenticateAdmin ,departmentController.createDepartment);
router.get("/:id", authenticateAdmin ,departmentController.getDepartmentById);
router.put("/:id", authenticateAdmin ,departmentController.updateDepartment);
router.delete("/:id", authenticateAdmin ,departmentController.deleteDepartment);

module.exports = router;
