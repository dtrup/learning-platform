// frontend/src/components/ContentPanel.jsx

import React, { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { generateGeminiContent } from '../services/api';
import { ScratchPadContext } from '../context/ScratchPadContext';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContentPanel = ({ section }) => {
    // Destructure addEntry from ScratchPadContext
    const { addEntry } = useContext(ScratchPadContext);

    // State hooks for copy button visibility and position
    const [copyButtonVisible, setCopyButtonVisible] = useState(false);
    const [copyButtonPosition, setCopyButtonPosition] = useState({ top: 0, left: 0 });

    // Reference to the content area
    const contentRef = useRef(null);

    // State hooks for content and loading states
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [followUp, setFollowUp] = useState('');
    const [followUpResponse, setFollowUpResponse] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            if (section && section.prompt) {
                setLoading(true);
                try {
                    const response = await generateGeminiContent(section.prompt);
                    setContent(response);
                } catch (error) {
                    setContent("Failed to load content.");
                    console.error("Error fetching content:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchContent();
    }, [section]);

    const handleFollowUp = async () => {
        if (followUp.trim() === '') return;
        try {
            const response = await generateGeminiContent(followUp);
            setFollowUpResponse(response);
        } catch (error) {
            setFollowUpResponse("Failed to generate response.");
            console.error("Error generating follow-up:", error);
        }
    };

    const handleTextSelect = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setCopyButtonPosition({ top: rect.top + window.scrollY - 30, left: rect.left + window.scrollX + rect.width });
            setCopyButtonVisible(true);
        } else {
            setCopyButtonVisible(false);
        }
    };

    const handleCopy = () => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        if (selectedText) {
            addEntry(selectedText, section.title);
            toast.success("Selected text added to Scratch Pad!");
            setCopyButtonVisible(false);
            selection.removeAllRanges();
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleTextSelect);
        return () => {
            document.removeEventListener('mouseup', handleTextSelect);
        };
    }, [section]);

    return (
        <div className="relative flex-grow p-6 overflow-y-auto" ref={contentRef}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            {loading ? (
                <p className="text-gray-500">Loading content...</p>
            ) : (
                <ReactMarkdown className="prose prose-lg">
                    {content}
                </ReactMarkdown>
            )}
            <div className="flex items-center space-x-2 mt-6">
                <input
                    type="text"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="Ask a follow-up..."
                    className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleFollowUp}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                >
                    Submit
                </button>
            </div>
            {followUpResponse && (
                <div className="mt-4 p-4 bg-gray-100 rounded-md">
                    <ReactMarkdown className="prose prose-lg">
                        {followUpResponse}
                    </ReactMarkdown>
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            {/* Copy Button */}
            {copyButtonVisible && (
                <button
                    onClick={handleCopy}
                    className="absolute bg-green-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-green-600 transition-colors duration-200"
                    style={{ top: copyButtonPosition.top, left: copyButtonPosition.left }}
                >
                    Copy
                </button>
            )}
        </div>
    );
};

ContentPanel.propTypes = {
    section: PropTypes.object,
};

export default ContentPanel;
