const Department = require('../models/Department');

// ✅ Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error });
    }
};

// ✅ Create a new department
exports.createDepartment = async (req, res) => {
    try {
        const departments = req.body; // Expecting an array of department objects

        if (!Array.isArray(departments) || departments.length === 0) {
            return res.status(400).json({ message: "Invalid input. Provide an array of departments." });
        }

        const newDepartments = await Department.bulkCreate(departments);
        res.status(201).json(newDepartments);
    } catch (error) {
        res.status(500).json({ message: "Error creating departments", error });
    }
};


// ✅ Get department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: "Error fetching department", error });
    }
};

// ✅ Update a department
exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        await department.update(req.body);
        res.json(department);
    } catch (error) {
        res.status(500).json({ message: "Error updating department", error });
    }
};

// ✅ Delete a department
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        await department.destroy();
        res.json({ message: "Department deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error });
    }
};
