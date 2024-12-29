import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
async function fetchData() {
    try {
        const response = await axios.get('http://localhost:5000/api/treedata');
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
