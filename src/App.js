import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import GuidePage from './components/GuidePage';
import './index.css';

function App() {
    const [guides, setGuides] = useState([]);

    useEffect(() => {
        const fetchGuideData = async () => {
            try {
                const response = await fetch('/api/treedata');
                if (!response.ok) {
                    throw new Error('Failed to fetch guide data');
                }
                const data = await response.json();
                setGuides(data);
            } catch (error) {
                console.error(error);
                // Handle error appropriately, e.g., display an error message to the user
            }
        };

        fetchGuideData();
    }, []);

    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Layout><HomePage guides={guides} /></Layout>} />
                <Route path="/guides" element={<Layout><GuideListPage guides={guides} /></Layout>} />
                <Route path="/guides/:guideId" element={<Layout><GuidePage guides={guides} /></Layout>} />
                <Route path="/about" element={<Layout><AboutPage /></Layout>} />
                <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
            </Routes>
        </Router>
    );
}

// Placeholder components for the different pages
const HomePage = ({ guides }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Available Guides</h2>
        </div>
    );
};

const GuideListPage = ({ guides }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Available Guides</h2>
        </div>
    );
};

const AboutPage = () => <div>About Page Content</div>;
const AdminPage = () => <div>Admin Page Content</div>;

export default App;