// frontend/src/App.jsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import './index.css'; // Tailwind CSS
import { ScratchPadProvider } from './context/ScratchPadContext'; // Import the provider

const Home = lazy(() => import('./pages/Home'));
const GuideDetail = lazy(() => import('./pages/GuideDetail'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <ScratchPadProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    {/* Navbar */}
                    <Navbar />

                    {/* Main Content */}
                    <div className="flex-grow">
                        <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
                            <Routes>
                                {/* Home Page */}
                                <Route path="/" element={<Home />} />

                                {/* Guide Detail Page (Dynamic Route) */}
                                <Route path="/guides/:guideId" element={<GuideDetail />} />

                                {/* About Page */}
                                <Route path="/about" element={<About />} />

                                {/* Admin Panel */}
                                <Route path="/admin" element={<Admin />} />

                                {/* Fallback Route for 404 - Not Found */}
                                <Route path="*" element={
                                    <div className="flex-grow flex items-center justify-center">
                                        <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
                                    </div>
                                } />
                            </Routes>
                        </Suspense>
                    </div>

                    {/* Optional Footer */}
                    {/* <footer className="bg-gray-800 text-white text-center p-4">
                        &copy; {new Date().getFullYear()} Learning Platform. All rights reserved.
                    </footer> */}
                </div>
            </Router>
        </ScratchPadProvider>
    );
}

export default App;
