const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Admin} = require("../models"); // Import both Admin and User
require("dotenv").config();

if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env file!");
    process.exit(1);
}

// Store reset tokens temporarily (consider using a database in production)
const resetTokens = new Map();

// ✅ Register Admin
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }

        // Check if Admin exists
        const existingAdmin = await Admin.findOne({ where: { username } });
        if (existingAdmin) {
            return res.status(400).json({ error: "Username already taken" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create Admin
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



exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Fetch user from Admins table
        const admin = await Admin.findOne({ where: { username } });

        if (!admin) {
            return res.status(400).json({ error: "Admin not found" });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT Token with isAdmin set to true
        const token = jwt.sign(
            { id: admin.id, username: admin.username, isAdmin: true }, // Always set isAdmin to true
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set token in HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 3600000 // 1 hour
        });

        res.json({ message: "Login successful", isAdmin: true });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: "Login failed", details: error.message });
    }
};

// ✅ Forgot Password (by Email)
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // 🔍 Check if Admin exists
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) return res.status(404).json({ error: "Admin not found" });

        // 🔑 Generate Reset Token
        const token = crypto.randomBytes(32).toString("hex");
        resetTokens.set(token, admin.id); // Store token temporarily

        // 📩 Reset Password Link
        const resetLink = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/reset-password/${token}`;

        // ✉️ Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ Send Email with Clickable Link
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: "Password Reset Request",
            html: `
                <p>Hello <strong>${admin.username}</strong>,</p>
                <p>You requested to reset your password. Click the link below:</p>
                <p><a href="${resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a></p>
                <p>If you didn’t request this, please ignore this email.</p>
            `
        });

        res.json({ message: "Password reset link sent to your email." });

    } catch (error) {
        console.error("❌ Forgot Password Error:", error);
        res.status(500).json({ error: "Failed to send password reset email", details: error.message });
    }
};

// ✅ Reset Password - Update New Password
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!resetTokens.has(token)) return res.status(400).json({ error: "Invalid or expired token" });

        const adminId = resetTokens.get(token);
        resetTokens.delete(token);

        // 🔒 Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // ✅ Update Admin Password
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
