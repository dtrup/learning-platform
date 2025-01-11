// backend/controllers/generateGeminiController.js

const genAI = require('../utils/genAI'); // Import the shared instance

// Generate content
const generateContent = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        const result = await model.generateContent(prompt);
        res.json({ content: result.response.text() }); // Ensure consistent key 'content'
    } catch (error) {
        console.error("Gemini API call failed:", error.message);
        console.error("Stack trace:", error.stack);
        res.status(500).json({ error: 'Error generating response from Gemini API', details: error.message });
    }
};

module.exports = {
    generateContent
};
