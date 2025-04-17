const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Create a new event
router.post("/", eventController.createEvent); // POST /events

// Get all events
router.get("/", eventController.getAllEvents); // GET /events

// Get an event by ID
router.get("/:id", eventController.getEventById); // GET /events/:id

// Update an event by ID
router.put("/:id", eventController.updateEvent); // PUT /events/:id

// Delete an event by ID
router.delete("/:id", eventController.deleteEvent); // DELETE /events/:id

module.exports = router;
