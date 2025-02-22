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
        const { name, description } = req.body;
        const newDepartment = await Department.create({ name, description });
        res.status(201).json(newDepartment);
    } catch (error) {
        res.status(500).json({ message: "Error creating department", error });
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
