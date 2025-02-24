// backend/routes/treedata.js

const express = require('express');
const router = express.Router();
const { getAllGuides, getGuideById } = require('../controllers/treedataController');

// Route to get all guides
router.get('/', getAllGuides);

// Route to get a specific guide by ID
router.get('/:guideId', getGuideById);

module.exports = router;
