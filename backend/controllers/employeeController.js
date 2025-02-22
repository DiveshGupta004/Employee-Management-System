const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const employees = req.body; // Expecting an array of employee objects

        if (!Array.isArray(employees) || employees.length === 0) {
            return res.status(400).json({ message: "Invalid input. Provide an array of employees." });
        }

        // Use bulkCreate to insert multiple records at once
        const newEmployees = await Employee.bulkCreate(employees);

        res.status(201).json({
            message: "Employees added successfully.",
            data: newEmployees
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating employees", error });
    }
};


exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.update(req.body);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.destroy();
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error });
    }
};
