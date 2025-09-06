// backend/controllers/treedataController.js

const fs = require('fs');
const path = require('path');

// Load tree data from JSON file
const treeDataPath = path.join(__dirname, '..', 'data', 'treeData.json');
let treeData = [];

try {
    const data = fs.readFileSync(treeDataPath, 'utf8');
    treeData = JSON.parse(data);
    console.log("treeData loaded successfully.");
} catch (error) {
    console.error("Error loading treeData.json:", error);
}

// Get all guides
const getAllGuides = (req, res) => {
    res.json(treeData);
};

// Get specific guide by ID
const getGuideById = (req, res) => {
    const { guideId } = req.params;
    const guide = treeData.find(g => g.id === guideId);
    if (guide) {
        res.json(guide);
    } else {
        res.status(404).json({ error: 'Guide not found' });
    }
};

module.exports = {
    getAllGuides,
    getGuideById
};
