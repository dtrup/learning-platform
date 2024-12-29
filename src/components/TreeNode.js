import React, { useState } from 'react';

const TreeNode = ({ node }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    return (
        <li>
            <div className="flex items-center cursor-pointer" onClick={handleToggle}>
                {node.children && node.children.length > 0 && (
                    <span className="mr-1">
            {isOpen ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg> /* Down arrow */ : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg> /* Right arrow */}
          </span>
                )}
                <span>{node.title}</span>
            </div>
            {isOpen && node.children && (
                <ul className="ml-4">
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default TreeNode;