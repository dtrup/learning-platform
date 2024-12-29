// backend/controllers/generateGeminiController.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate content
const generateContent = async (req, res) => {
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
};

module.exports = {
    generateContent
};
