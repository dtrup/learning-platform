import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const GuidePage = ({ guides }) => {
    const { guideId } = useParams();
    const [selectedGuide, setSelectedGuide] = useState(null);

    useEffect(() => {
        // Find the selected guide based on the guideId from the URL
        const guide = guides.find(g => g.id === guideId);
        setSelectedGuide(guide);
    }, [guideId, guides]);

    return (
        <div>
            {selectedGuide && (
                <>
                    <h2 className="text-2xl font-bold mb-4">{selectedGuide.title}</h2>
                </>
            )}
        </div>
    );
};

export default GuidePage;