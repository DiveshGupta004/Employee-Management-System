const { Admin } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env file!");
    process.exit(1);
}

// Store reset tokens temporarily (use a database in production)
const resetTokens = new Map();

// ✅ Register Admin
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // ✅ Check if Admin already exists
        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        // ✅ Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create Admin
        const newAdmin = await Admin.create({ username, email, password: hashedPassword });

        res.status(201).json({
            message: "Admin registered successfully",
            admin: { id: newAdmin.id, username: newAdmin.username, email: newAdmin.email }
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
            { id: admin.id, username: admin.username, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // ✅ Store token in HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Ensure secure in production
            sameSite: "Strict",
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: "Login successful" });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

// ✅ Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const admin = await Admin.findOne({ where: { email } });

        if (!admin) return res.status(404).json({ error: "Admin not found" });

        const token = crypto.randomBytes(32).toString("hex");
        resetTokens.set(token, admin.id);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // ✅ Configure email transport
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: "Password Reset Request",
            text: `Click the link to reset your password: ${resetLink}`,
        });

        res.json({ message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ error: "Failed to send password reset email", details: error.message });
    }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!resetTokens.has(token)) return res.status(400).json({ error: "Invalid or expired token" });

        const adminId = resetTokens.get(token);
        resetTokens.delete(token);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Admin.update({ password: hashedPassword }, { where: { id: adminId } });

        res.json({ message: "Password reset successful." });

    } catch (error) {
        console.error("❌ Reset Password Error:", error);
        res.status(500).json({ error: "Failed to reset password", details: error.message });
    }
};

// ✅ Logout Admin
exports.logout = async (req, res) => {
    res.clearCookie("auth_token");
    res.json({ message: "Logout successful" });
};
