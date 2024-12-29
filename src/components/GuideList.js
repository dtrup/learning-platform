import React from 'react';
import GuideCard from './GuideCard';

const GuideList = ({ guides, onGuideSelect }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Available Guides</h2>
            {guides.map(guide => (
                <GuideCard key={guide.id} guide={guide} onGuideSelect={onGuideSelect} />
            ))}
        </div>
    );
};

export default GuideList;