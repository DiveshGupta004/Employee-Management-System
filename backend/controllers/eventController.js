const CreateEvent = require("../models/createEvent");

// Create a new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      event_date,
      location,
      event_type,
      target_audience,
      rsvp_deadline,
      reminder_time,
      calendar_integration,
    } = req.body;

    const newEvent = await CreateEvent.create({
      title,
      description,
      event_date,
      location,
      event_type,
      target_audience,
      rsvp_deadline,
      reminder_time,
      calendar_integration,
    });

    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error: error.message });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await CreateEvent.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

// Get an event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await CreateEvent.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await CreateEvent.update(req.body, { where: { event_id: id } });

    if (!updatedEvent[0]) {
      return res.status(404).json({ message: "Event not found or no changes made" });
    }

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error: error.message });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CreateEvent.destroy({ where: { event_id: id } });

    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
