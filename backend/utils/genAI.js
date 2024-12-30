// backend/utils/genAI.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Ensure environment variables are loaded
if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in the environment variables.");
    process.exit(1);
}

// Initialize Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = genAI;
