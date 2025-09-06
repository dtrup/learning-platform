// frontend/src/pages/Admin.jsx

import React, { useState } from 'react';
// import axios from 'axios';
// import './Admin.css';

const Admin = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a JSON file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Implement backend endpoint to handle file uploads
            // For now, just log the file
            console.log("Uploading file:", file);
            setMessage("File uploaded successfully (functionality not implemented).");
        } catch (error) {
            console.error("Error uploading file:", error);
            setMessage("Failed to upload file.");
        }
    };

    return (
        <div className="admin-panel">
            <h1>Admin Panel</h1>
            <div className="upload-section">
                <input type="file" accept=".json" onChange={handleFileChange} />
                <button onClick={handleUpload}>Upload Guide</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Admin;
