const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectdetailsController');
const { authenticateAdmin, authenticateEmployee } = require('../middleware/adminMiddleware');

router.post('/', authenticateAdmin, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.put('/:id', authenticateAdmin, projectController.updateProject);
router.delete('/:id', authenticateAdmin, projectController.deleteProject);

module.exports = router;