const { Department } = require("../models");

// Get all departments
exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.findAll();
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching departments", error: error.message });
    }
};

// Create a department
exports.createDepartment = async (req, res) => {
    try {
        const { name } = req.body;

        if (Array.isArray(req.body)) {

            if (req.body.length === 0) {
                return res.status(400).json({ message: "Invalid input. Provide an array of departments." });
            }

            const departments = await Department.bulkCreate(req.body, { validate: true });

            return res.status(201).json({ message: "Departments created successfully", data: departments });
        }

        if (!name) {
            return res.status(400).json({ message: "Department name is required" });
        }


        const department = await Department.create({ name });

        res.status(201).json({ message: "Department created", data: department });

    } catch (error) {
        res.status(500).json({ message: "Error creating department", error: error.message });
    }
};


// Get department by ID
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        res.json(department);
    } catch (error) {
        res.status(500).json({ message: "Error fetching department", error: error.message });
    }
};

// Update department
exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        await department.update(req.body);
        res.json({ message: "Department updated", data: department });
    } catch (error) {
        res.status(500).json({ message: "Error updating department", error: error.message });
    }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByPk(req.params.id);
        if (!department) return res.status(404).json({ message: "Department not found" });

        await department.destroy();
        res.json({ message: "Department deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting department", error: error.message });
    }
};
