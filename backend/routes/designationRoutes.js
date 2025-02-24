const express = require('express');
const router = express.Router();
const designationController = require('../controllers/designationController');
const { authenticateAdmin } = require("../middleware/adminMiddleware");

router.get('/', authenticateAdmin ,designationController.getAllDesignations);
router.get('/:id', authenticateAdmin ,designationController.getDesignationById);
router.post('/', authenticateAdmin ,designationController.createDesignation);
router.put('/:id', authenticateAdmin ,designationController.updateDesignation);
router.delete('/:id', authenticateAdmin ,designationController.deleteDesignation);

module.exports = router;
