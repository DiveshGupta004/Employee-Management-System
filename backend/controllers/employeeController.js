const { Employee } = require("../models");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const employee = await Employee.findOne({ where: { email } });

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        const token = jwt.sign(
            { id: employee.id, email: employee.email, isAdmin: false },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ message: "Employee created successfully", data: employee });
    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.update(req.body);
        res.json({ message: "Employee updated successfully", data: employee });
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: "Employee not found" });

        await employee.destroy();
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};

module.exports = {
    login,
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
