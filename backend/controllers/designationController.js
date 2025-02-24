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

            // Convert level to integer
            const processedDesignations = req.body.map(d => ({
                name: d.name,
                level: parseInt(d.level, 10) || null // Ensure it's an integer
            }));

            // Validate that all levels are valid integers
            if (processedDesignations.some(d => d.level === null)) {
                return res.status(400).json({ message: "Invalid level. It must be an integer." });
            }

            const newDesignations = await Designation.bulkCreate(processedDesignations, { validate: true });
            return res.status(201).json({ message: "Designations created successfully", data: newDesignations });
        }

        // Handle single designation
        const { name, level } = req.body;
        if (!name || level === undefined) {
            return res.status(400).json({ message: "Name and level are required for a designation." });
        }

        const parsedLevel = parseInt(level, 10);
        if (isNaN(parsedLevel)) {
            return res.status(400).json({ message: "Invalid level. It must be an integer." });
        }

        const newDesignation = await Designation.create({ name, level: parsedLevel });
        res.status(201).json({ message: "Designation created successfully", data: newDesignation });

    } catch (error) {
        res.status(500).json({ message: "Error creating designation", error: error.message });
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

        if (level !== undefined) {
            const parsedLevel = parseInt(level, 10);
            if (isNaN(parsedLevel)) {
                return res.status(400).json({ message: "Invalid level. It must be an integer." });
            }
            req.body.level = parsedLevel;
        }

        await designation.update(req.body);
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
