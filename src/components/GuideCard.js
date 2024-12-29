import React from 'react';

const GuideCard = ({ guide, onGuideSelect }) => {
    return (
        <div
            className="bg-white p-4 rounded shadow mb-4 cursor-pointer hover:bg-gray-100"
            onClick={() => onGuideSelect(guide)}
        >
            <h3 className="text-xl font-semibold">{guide.title}</h3>
        </div>
    );
};

export default GuideCard;