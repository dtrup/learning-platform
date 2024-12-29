import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GuideList from './GuideList';
import NavigationTree from './NavigationTree';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Layout = ({ children }) => {
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionContent, setSectionContent] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch guide data
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
                // Handle error appropriately
            }
        };

        fetchGuideData();
    }, []);

    // Fetch section content
    useEffect(() => {
        const fetchSectionContent = async () => {
            if (selectedSection) {
                setSectionContent(''); // Clear previous content

                // Only fetch if not a container section
                if (!selectedSection.children || selectedSection.children.length === 0) {
                    try {
                        const response = await fetch('/api/generate-gemini', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ prompt: selectedSection.prompt }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(
                                `Failed to fetch content: ${response.status} ${errorData.error || ''
                                }`
                            );
                        }

                        const data = await response.json();
                        setSectionContent(data.response);
                    } catch (error) {
                        console.error(error);
                        setSectionContent(`Error fetching content: ${error.message}`);
                    }
                }
            }
        };

        fetchSectionContent();
    }, [selectedSection]);

    const handleGuideSelect = (guide) => {
        setSelectedGuide(guide);
        navigate(`/guides/${guide.id}`);
    };

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
    };

    return (
        <div className="flex h-screen">
            {/* Navigation Panel (Left) */}
            <div className="w-1/4 bg-gray-200 p-4">
                {selectedGuide && (
                    <NavigationTree
                        nodes={selectedGuide.children}
                        onNodeClick={handleSectionSelect}
                        selectedSectionId={selectedSection ? selectedSection.id : null}
                    />
                )}
            </div>

            {/* Content Display Panel (Center) */}
            <div className="w-1/2 bg-gray-100 p-4">
                <div className="bg-white p-4 rounded shadow">
                    {/* Show GuideList only on Home or Guides pages, otherwise show selected Guide */}
                    {(location.pathname === '/' || location.pathname === '/guides') ? (
                        <GuideList guides={guides} onGuideSelect={handleGuideSelect} />
                    ) : (
                        <>
                            {/* Display selected guide's title */}
                            {selectedGuide && (
                                <h2 className="text-2xl font-bold mb-4">{selectedGuide.title}</h2>
                            )}

                            {/* Display section prompt and fetched content */}
                            {selectedSection && (!selectedSection.children || selectedSection.children.length === 0) && (
                                <div className="mt-4">
                                    <h3 className="text-xl font-semibold mb-2">
                                        {selectedSection.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Prompt: {selectedSection.prompt}
                                    </p>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {sectionContent}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Scratch Pad Panel (Right) */}
            <div className="w-1/4 bg-gray-200 p-4">
                <div className="bg-white p-2 rounded shadow">Scratch Pad</div>
            </div>
        </div>
    );
};

export default Layout;