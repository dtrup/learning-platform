// backend/routes/generateGemini.js

const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/generateGeminiController');

// Define POST route to generate Gemini content
router.post('/', generateContent);

module.exports = router;
