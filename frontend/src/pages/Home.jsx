// frontend/src/pages/Home.jsx

import React, { useEffect, useState } from 'react';
import { getAllGuides } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGuides = async () => {
            try {
                const data = await getAllGuides();
                setGuides(data);
            } catch (err) {
                setError('Failed to load guides.');
                console.error("Error fetching guides:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuides();
    }, []);

    if (loading) return <div className="text-center mt-10">Loading guides...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Available Guides</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map(guide => {
                    // Use the guide's own prompt as summary
                    const summary = guide.prompt
                        ? `${guide.prompt.slice(0, 100)}...`
                        : 'No description available.';

                    return (
                        <div key={guide.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col">
                            <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
                            <p className="text-gray-600 flex-grow">{summary}</p>
                            <Link to={`/guides/${guide.id}`} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 text-center">
                                Start Guide
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
