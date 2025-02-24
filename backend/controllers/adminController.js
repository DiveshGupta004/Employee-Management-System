const { Admin } = require("../models"); // ✅ Correct reference to Admin model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env file!");
    process.exit(1);
}

// ✅ Register Admin (Username & Password Only)
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // ✅ Check if Admin already exists
        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create Admin
        const newAdmin = await Admin.create({ username, password: hashedPassword });

        // ✅ Generate Token
        const token = jwt.sign(
            { id: newAdmin.id, username: newAdmin.username, isAdmin: true }, // ✅ Add `isAdmin: true`
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({ 
            message: "Admin registered successfully", 
            admin: { id: newAdmin.id, username: newAdmin.username },
            token // ✅ Return token
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);
        res.status(500).json({ error: "Admin registration failed", details: error.message });
    }
};

// ✅ Login Admin
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // ✅ Fetch admin from database
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) return res.status(400).json({ error: "Admin not found" });

        // ✅ Check password
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: admin.id, username: admin.username, isAdmin: true }, // ✅ Add `isAdmin: true`
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};
