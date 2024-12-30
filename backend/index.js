// backend/index.js

require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const treedataRoutes = require('./routes/treedata');
const generateGeminiRoutes = require('./routes/generateGemini');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin or use an environment variable
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Routes
app.use('/api/treedata', treedataRoutes);
app.use('/api/generate', generateGeminiRoutes); // Mounted at '/api/generate'

// Health Check Endpoint (Optional)
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK' });
});

// 404 Handler for Undefined Routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
