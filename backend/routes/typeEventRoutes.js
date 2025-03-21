const express = require('express');
const router = express.Router();
const typeEventController = require('../controllers/TypeEventController');
const { authenticateAdmin } = require("../middleware/adminMiddleware");

router.get('/', authenticateAdmin, typeEventController.getAllEventTypes);
router.get('/:id', authenticateAdmin, typeEventController.getEventTypeById);
router.post('/', authenticateAdmin, typeEventController.createEventType);
router.put('/:id', authenticateAdmin, typeEventController.updateEventType);
router.delete('/:id', authenticateAdmin, typeEventController.deleteEventType);

module.exports = router;
