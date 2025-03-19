const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Create a new event
router.post("/create", eventController.createEvent);

// Get all events
router.get("/all", eventController.getAllEvents);

// Get an event by ID
router.get("/:id", eventController.getEventById);

// Update an event by ID
router.put("/:id", eventController.updateEvent);

// Delete an event by ID
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
