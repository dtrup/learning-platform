// frontend/src/components/GuidePanel.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';

const GuidePanel = ({ treeData, onSelect }) => {
    const [expandedNodes, setExpandedNodes] = useState({});

    const toggleNode = (id) => {
        setExpandedNodes(prevState => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    /**
     * Recursively renders the tree nodes.
     * @param {Object} node - The current node.
     * @param {number} depth - The current depth for indentation.
     * @returns {JSX.Element} The rendered node.
     */
    const renderTree = (node, depth = 0) => {
        const isExpanded = expandedNodes[node.id];
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className={`ml-${depth * 4} mt-2`}>
                <div className="flex items-center">
                    {hasChildren ? (
                        <button
                            onClick={() => toggleNode(node.id)}
                            className="mr-2 focus:outline-none text-gray-600 hover:text-gray-800"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            {isExpanded ? '-' : '+'}
                        </button>
                    ) : (
                        <span className="mr-2 w-4"></span> // Placeholder for alignment
                    )}
                    <button
                        onClick={() => onSelect(node)}
                        className="text-left focus:outline-none hover:text-blue-500"
                    >
                        {node.title}
                    </button>
                </div>
                {hasChildren && isExpanded && (
                    <div>
                        {node.children.map(child => renderTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    // Start rendering from the second level (children of the root)
    return (
        <div className="p-4 overflow-y-auto h-full">
            <h2 className="text-xl font-semibold mb-4">Guides</h2>
            {treeData.children && treeData.children.length > 0 ? (
                treeData.children.map(child => renderTree(child))
            ) : (
                <p>No sections available.</p>
            )}
        </div>
    );
};

GuidePanel.propTypes = {
    treeData: PropTypes.object.isRequired, // Root guide object containing children
    onSelect: PropTypes.func.isRequired,   // Function to handle section selection
};

export default GuidePanel;
