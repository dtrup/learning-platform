// backend/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const treedataRoutes = require('./routes/treedata');
const generateGeminiRoutes = require('./routes/generateGemini');

// Use Routes
app.use('/api/treedata', treedataRoutes);
app.use('/api/generate-gemini', generateGeminiRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Learning Platform API');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
