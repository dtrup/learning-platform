// frontend/src/components/GuidePanel.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

/**
 * Displays a tree of guide sections with expand/collapse,
 * using simple caret icons in place of + and -.
 */
const GuidePanel = ({ treeData, onSelect }) => {
    const [expandedNodes, setExpandedNodes] = useState({});

    const toggleNode = (id) => {
        setExpandedNodes(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    /**
     * Recursively renders each node and its children.
     * @param {Object} node - The current node.
     * @param {number} depth - The indentation level.
     */
    const renderTree = (node, depth = 0) => {
        const isExpanded = expandedNodes[node.id];
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.id} className="mt-2">
                <div
                    className="flex items-center"
                    style={{ paddingLeft: `${1.2 * depth}rem` }} // dynamic indent
                >
                    {hasChildren ? (
                        <button
                            onClick={() => toggleNode(node.id)}
                            className="mr-2 focus:outline-none text-gray-600 hover:text-gray-800"
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                        </button>
                    ) : (
                        // If no children, just reserve some space so titles line up
                        <span className="mr-6" />
                    )}

                    <button
                        onClick={() => onSelect(node)}
                        className="text-left focus:outline-none hover:text-blue-500"
                    >
                        {node.title}
                    </button>
                </div>

                {hasChildren && isExpanded && (
                    <div className="border-l border-gray-300 ml-4 pl-2">
                        {node.children.map(child => renderTree(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

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
    treeData: PropTypes.object.isRequired, // Root guide object containing {children: [...]}
    onSelect: PropTypes.func.isRequired,   // Called with the node the user clicked
};

export default GuidePanel;
