const { Employee } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
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
        // Destructure the password and other fields from req.body
        const { password, ...otherDetails } = req.body;

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);  // You can adjust the number of rounds based on your security requirement
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the employee with the hashed password
        const employee = await Employee.create({
            ...otherDetails,
            password: hashedPassword
        });

        // Respond with the created employee data
        // Note: It's often a good practice not to send sensitive data like the password back in the response
        const { password: _, ...employeeData } = employee.get({ plain: true });
        res.status(201).json({ message: "Employee created successfully", data: employeeData });
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

        // If the password is being updated, hash it before saving
        if (req.body.password) {
            const saltRounds = 10;
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

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
