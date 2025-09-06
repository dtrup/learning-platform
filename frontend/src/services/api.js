// frontend/src/services/api.js

import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Update as per your backend configuration

/**
 * Fetch all guides.
 * @returns {Promise<Object[]>} Array of guide objects.
 */
export const getAllGuides = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/treedata`);
        return response.data;
    } catch (error) {
        console.error("Error fetching guides:", error);
        throw error;
    }
};

/**
 * Fetch a specific guide by ID.
 * @param {string} guideId - The ID of the guide to fetch.
 * @returns {Promise<Object>} The guide object.
 */
export const getGuideById = async (guideId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/treedata/${guideId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching guide with ID ${guideId}:`, error);
        throw error;
    }
};

/**
 * Generate content based on a prompt using the LLM.
 * @param {string} prompt - The prompt to send to the LLM.
 * @returns {Promise<string>} The generated content.
 */
export const generateLLMContent = async (prompt) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/generate`, {
            prompt,
            // You might want to add additional metadata
            includeContext: true,
            timestamp: new Date().toISOString()
        });

        console.log("generateLLMContent response:", response.data);
        return response.data.content;
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
};