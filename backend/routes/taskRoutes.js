const express = require('express');
const { createTask, updateTask, deleteTask, getTasks, getTaskById } = require('../controllers/taskController');
const { authenticateAdmin, authenticateEmployee } = require('../middleware/adminMiddleware');

const router = express.Router();

// Admin routes
router.post('/', authenticateAdmin, createTask); // Assign task
router.put('/:id', authenticateAdmin, updateTask); // Update task
router.delete('/:id', authenticateAdmin, deleteTask); // Delete task

// Common routes
router.get('/', getTasks); // Get all tasks
router.get('/:id', getTaskById); // Get task by ID

module.exports = router;
