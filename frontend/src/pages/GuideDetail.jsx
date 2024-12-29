// frontend/src/pages/GuideDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGuideById } from '../services/api';
import GuidePanel from '../components/GuidePanel';
import ContentPanel from '../components/ContentPanel';
import ScratchPad from '../components/ScratchPad';
import Split from 'react-split';
import '../index.css'; // Ensure this import is present for CSS styles

const GuideDetail = () => {
    const { guideId } = useParams();
    const [guide, setGuide] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGuide = async () => {
            try {
                const data = await getGuideById(guideId);
                setGuide(data);
                // Optionally, select the first section by default
                if (data.children && data.children.length > 0) {
                    setSelectedSection(data.children[0]);
                }
            } catch (err) {
                setError('Failed to load the selected guide.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGuide();
    }, [guideId]);

    if (loading) return <div className="text-center mt-10">Loading guide...</div>;
    if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
    if (!guide) return <div className="text-center mt-10">No guide found.</div>;

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
    };

    return (
        <div className="h-screen">
            <Split
                className="flex h-full"
                sizes={[25, 50, 25]} // Allocate 25%, 50%, 25% to panels
                minSize={[200, 300, 200]} // Set minimum sizes for each panel
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                // Removed the gutter function to prevent mutation errors
            >
                {/* Guide Panel */}
                <GuidePanel treeData={guide} onSelect={handleSectionSelect} />

                {/* Content Panel */}
                <ContentPanel section={selectedSection} />

                {/* Scratch Pad */}
                <ScratchPad />
            </Split>
        </div>
    );
};

export default GuideDetail;
