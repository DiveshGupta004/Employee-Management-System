const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { authenticateAdmin, authenticateEmployee } = require('../middleware/adminMiddleware');

// Create a new event
router.post("/", authenticateAdmin, eventController.createEvent); // POST /events

// Get all events
router.get("/", eventController.getAllEvents); // GET /events

// Get upcoming events only
router.get("/upcoming", eventController.getUpcomingEvents); // ✅ NEW: GET /events/upcoming

// Get an event by ID
router.get("/:id", eventController.getEventById); // GET /events/:id

// Update an event by ID
router.put("/:id", authenticateAdmin, eventController.updateEvent); // PUT /events/:id

// Delete an event by ID
router.delete("/:id", authenticateAdmin, eventController.deleteEvent); // DELETE /events/:id

module.exports = router;
