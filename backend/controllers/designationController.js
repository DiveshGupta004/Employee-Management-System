const Designation = require('../models/Designation');

// Get all designations
exports.getAllDesignations = async (req, res) => {
    try {
        const designations = await Designation.findAll();
        res.json(designations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching designations", error });
    }
};

// Get a designation by ID
exports.getDesignationById = async (req, res) => {
    try {
        const designation = await Designation.findByPk(req.params.id);
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        res.json(designation);
    } catch (error) {
        res.status(500).json({ message: "Error fetching designation", error });
    }
};

// Create a new designation
exports.createDesignation = async (req, res) => {
    try {
        const { name, level } = req.body;
        const newDesignation = await Designation.create({ name, level });
        res.status(201).json(newDesignation);
    } catch (error) {
        res.status(500).json({ message: "Error creating designation", error });
    }
};

// Update a designation
exports.updateDesignation = async (req, res) => {
    try {
        const { name, level } = req.body;
        const designation = await Designation.findByPk(req.params.id);
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        await designation.update({ name, level });
        res.json(designation);
    } catch (error) {
        res.status(500).json({ message: "Error updating designation", error });
    }
};

// Delete a designation
exports.deleteDesignation = async (req, res) => {
    try {
        const designation = await Designation.findByPk(req.params.id);
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }
        await designation.destroy();
        res.json({ message: "Designation deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting designation", error });
    }
};
