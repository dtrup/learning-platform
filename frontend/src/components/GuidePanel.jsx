// frontend/src/components/GuidePanel.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GuidePanel = ({ treeData, onSelect }) => {
    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpand = (id) => {
        setExpandedIds(prev =>
            prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]
        );
    };

    const renderTree = (node, level = 0) => {
        const isExpanded = expandedIds.includes(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className={`pl-${level * 4} py-1`}>
                <div className="flex items-center">
                    {hasChildren && (
                        <button
                            onClick={() => toggleExpand(node.id)}
                            className="mr-2 focus:outline-none text-gray-600 hover:text-blue-500"
                            aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                        >
                            {isExpanded ? '-' : '+'}
                        </button>
                    )}
                    <button
                        onClick={() => onSelect(node)}
                        className="text-left text-gray-700 hover:text-blue-500 transition-colors duration-200 w-full"
                    >
                        {node.title}
                    </button>
                </div>
                {hasChildren && isExpanded && (
                    <div className="ml-4">
                        {node.children.map(child => renderTree(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-100 w-full h-full p-4 overflow-y-auto border-r border-gray-300">
            <h2 className="text-xl font-semibold mb-4">{treeData.title}</h2>
            <div>
                {treeData.children.map(child => renderTree(child))}
            </div>
        </div>
    );
};

GuidePanel.propTypes = {
    treeData: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default GuidePanel;
