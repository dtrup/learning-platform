// frontend/src/pages/Guides.jsx

import React, { useEffect, useState } from 'react';
import { getTreeData } from '../services/api';
import GuidePanel from '../components/GuidePanel';
import ContentPanel from '../components/ContentPanel';
import ScratchPad from '../components/ScratchPad';
import './Guides.css'; // Create CSS as needed

const Guides = () => {
    const [treeData, setTreeData] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTreeData();
                setTreeData(data);
            } catch (error) {
                console.error("Failed to fetch tree data:", error);
            }
        };
        fetchData();
    }, []);

    const handleSectionSelect = (section) => {
        setSelectedSection(section);
    };

    return (
        <div className="guides-container">
            <GuidePanel treeData={treeData} onSelect={handleSectionSelect} />
            <ContentPanel section={selectedSection} />
            <ScratchPad />
        </div>
    );
};

export default Guides;
