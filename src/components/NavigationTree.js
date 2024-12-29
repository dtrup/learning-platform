import React, { useState } from 'react';

const TreeNode = ({ node, onNodeClick, selectedSectionId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isSection = node.children && node.children.length > 0;

    const handleToggle = (event) => {
        event.stopPropagation(); // Prevent click event from bubbling up
        setIsOpen(!isOpen);
    };

    const handleNodeClick = () => {
        onNodeClick(node); // Call the onNodeClick prop (which updates selectedSection in Layout)
        // If it's a section with children, automatically open it
        if (isSection) {
            setIsOpen(true);
        }
    };

    const isActive = selectedSectionId === node.id;

    return (
        <li>
            <div
                className={`flex items-center cursor-pointer p-1 rounded ${
                    isSection ? 'hover:bg-gray-200' : 'font-semibold hover:bg-blue-200'
                } ${isActive ? 'bg-blue-300' : ''}`}
                onClick={handleNodeClick}
            >
                {isSection && (
                    <span className="mr-1" onClick={handleToggle}>
            {isOpen ? (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            ) : (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
            )}
          </span>
                )}
                <span className="flex-1">{node.title}</span>
            </div>
            {/* Render children only if isOpen is true */}
            {isOpen && node.children && (
                <ul className="ml-6">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            onNodeClick={onNodeClick}
                            selectedSectionId={selectedSectionId}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

const NavigationTree = ({ nodes, onNodeClick, selectedSectionId }) => {
    return (
        <ul>
            {nodes.map(node => (
                <TreeNode
                    key={node.id}
                    node={node}
                    onNodeClick={onNodeClick}
                    selectedSectionId={selectedSectionId}
                />
            ))}
        </ul>
    );
};

export default NavigationTree;