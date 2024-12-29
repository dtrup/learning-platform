// frontend/src/services/api.js

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Fetch all guides
export const getAllGuides = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/treedata`);
        return response.data;
    } catch (error) {
        console.error("Error fetching guides:", error);
        throw error;
    }
};

// Fetch a specific guide by ID
export const getGuideById = async (guideId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/treedata/${guideId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching guide with ID ${guideId}:`, error);
        throw error;
    }
};

// Generate Gemini Content
export const generateGeminiContent = async (prompt) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/generate-gemini`, { prompt });
        return response.data.response;
    } catch (error) {
        console.error("Error generating Gemini content:", error);
        throw error;
    }
};
