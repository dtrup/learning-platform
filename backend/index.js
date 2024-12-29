// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = process.env.PORT || 5000;

// Load initial tree data from a local file (we'll create this later)
const treeData = require('./data/treeData.json');

app.use(cors());
app.use(express.json());

// Gemini Setup (replace with your actual API key)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint to get tree data
app.get('/api/treedata', (req, res) => {
    res.json(treeData);
});

// Placeholder endpoint for Gemini API (we'll implement this later)
app.post('/api/generate-gemini', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error("Gemini API call failed:", error);
        res.status(500).json({ error: 'Error generating response from Gemini API' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});