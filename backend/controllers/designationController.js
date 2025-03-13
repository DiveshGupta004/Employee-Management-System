const { Designation } = require("../models");

// Get all designations
exports.getAllDesignations = async (req, res) => {
    try {
        const designations = await Designation.findAll();
        res.json(designations);
    } catch (error) {
        res.status(500).json({ message: "Error fetching designations", error: error.message });
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
        res.status(500).json({ message: "Error fetching designation", error: error.message });
    }
};

// Create a new designation (Single or Multiple)
exports.createDesignation = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            // Handle multiple designations
            if (req.body.length === 0) {
                return res.status(400).json({ message: "Invalid input. Provide an array of designations." });
            }

            const processedDesignations = req.body.map(d => ({
                name: d.name
            }));

            const newDesignations = await Designation.bulkCreate(processedDesignations, { validate: true });
            return res.status(201).json({ message: "Designations created successfully", data: newDesignations });
        }

        // Handle single designation
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required for a designation." });
        }

        const newDesignation = await Designation.create({ name });
        res.status(201).json({ message: "Designation created successfully", data: newDesignation });

    } catch (error) {
        res.status(500).json({ message: "Error creating designation", error: error.message });
    }
};


// Update a designation
exports.updateDesignation = async (req, res) => {
    try {
        const { name } = req.body;
        const designation = await Designation.findByPk(req.params.id);
        
        if (!designation) {
            return res.status(404).json({ message: "Designation not found" });
        }

        await designation.update({ name });
        res.json({ message: "Designation updated successfully", data: designation });
    } catch (error) {
        res.status(500).json({ message: "Error updating designation", error: error.message });
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
        res.status(500).json({ message: "Error deleting designation", error: error.message });
    }
};
