const { TypeEvent } = require("../models");

// Get all event types
exports.getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await TypeEvent.findAll();
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event types", error: error.message });
    }
};

// Get an event type by ID
exports.getEventTypeById = async (req, res) => {
    try {
        const eventType = await TypeEvent.findByPk(req.params.id);
        if (!eventType) {
            return res.status(404).json({ message: "Event type not found" });
        }
        res.json(eventType);
    } catch (error) {
        res.status(500).json({ message: "Error fetching event type", error: error.message });
    }
};

// Create a new event type (Single or Multiple)
exports.createEventType = async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            if (req.body.length === 0) {
                return res.status(400).json({ message: "Invalid input. Provide an array of event types." });
            }
            const processedEventTypes = req.body.map(e => ({ name: e.name }));
            const newEventTypes = await TypeEvent.bulkCreate(processedEventTypes, { validate: true });
            return res.status(201).json({ message: "Event types created successfully", data: newEventTypes });
        }

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required for an event type." });
        }

        const newEventType = await TypeEvent.create({ name });
        res.status(201).json({ message: "Event type created successfully", data: newEventType });
    } catch (error) {
        res.status(500).json({ message: "Error creating event type", error: error.message });
    }
};

// Update an event type
exports.updateEventType = async (req, res) => {
    try {
        const { name } = req.body;
        const eventType = await TypeEvent.findByPk(req.params.id);
        
        if (!eventType) {
            return res.status(404).json({ message: "Event type not found" });
        }

        await eventType.update({ name });
        res.json({ message: "Event type updated successfully", data: eventType });
    } catch (error) {
        res.status(500).json({ message: "Error updating event type", error: error.message });
    }
};

// Delete an event type
exports.deleteEventType = async (req, res) => {
    try {
        const eventType = await TypeEvent.findByPk(req.params.id);
        if (!eventType) {
            return res.status(404).json({ message: "Event type not found" });
        }
        await eventType.destroy();
        res.json({ message: "Event type deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event type", error: error.message });
    }
};
