// frontend/src/components/FloatingToolbar.jsx

import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const FloatingToolbar = ({ position, onSave }) => {
    const portalTarget = document.getElementById('portal-root');
    if (!portalTarget) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold
                 py-1 px-3 rounded shadow-md z-50 cursor-pointer transition-transform duration-200
                 transform scale-95 animate-fadeIn"
            style={{
                top: position.top + window.scrollY,
                left: position.left + window.scrollX + 10, // Slight offset to prevent overlap
                transform: 'translate(-50%, -100%)',
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent losing text selection
            onClick={onSave}
        >
            💾 Save
        </div>,
        portalTarget
    );
};

FloatingToolbar.propTypes = {
    position: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
};

export default FloatingToolbar;
