// backend/routes/generateGemini.js

const express = require('express');
const router = express.Router();
const { generateContent } = require('../controllers/generateGeminiController');

// Route to generate content using Gemini AI
router.post('/', generateContent);

module.exports = router;
