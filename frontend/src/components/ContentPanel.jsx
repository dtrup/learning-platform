// frontend/src/components/ContentPanel.jsx

import React, { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { generateLLMContent } from '../services/api';
import { ScratchPadContext } from '../context/ScratchPadContext';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperPlane } from 'react-icons/fa'; // Importing send icon
import FloatingToolbar from './FloatingToolbar'; // Import FloatingToolbar
import Split from 'react-split'; // Import react-split for resizable panels
//import 'react-split/style.css'; // Import react-split styles (if using v1.x)

const ContentPanel = ({ section }) => {
    const {addEntry} = useContext(ScratchPadContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({top: 0, left: 0});
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchContent = async () => {
            if (section && section.prompt) {
                setLoading(true);
                setCurrentPrompt(section.prompt);
                try {
                    const response = await generateLLMContent(section.prompt);
                    setContent(response); // Replace content with new section's response

                    // Add system message to chat
                    const systemMessage = {sender: 'system', text: response};
                    setChatMessages(prev => [...prev, systemMessage]);
                } catch (error) {
                    setContent("Failed to load content.");
                    toast.error("Failed to load content.");
                    console.error("Error fetching content:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setContent('');
                setCurrentPrompt('');
                setChatMessages([]); // Clear chat messages if no section is selected
            }
        };
        fetchContent();
    }, [section]);

    // Scroll to the bottom of chat when new message arrives
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [chatMessages]);

    // Handle chat submission
    const handleChatSubmit = async () => {
        if (chatInput.trim() === '') return;

        // Add user message
        const userMessage = {sender: 'user', text: chatInput};
        setChatMessages(prev => [...prev, userMessage]);

        // Append user message to content
        setContent(prevContent => prevContent + '\n\n**You:** ' + chatInput);

        // Clear the input field
        setChatInput('');

        // Generate response from LLM
        setLoading(true);
        try {
            const response = await generateLLMContent(chatInput);
            const botMessage = {sender: 'bot', text: response};
            setChatMessages(prev => [...prev, botMessage]);

            // Append bot response to content
            setContent(prevContent => prevContent + '\n\n**Bot:** ' + response);
        } catch (error) {
            console.error("Error in chat:", error);
            const errorMessage = {sender: 'bot', text: "Failed to get response."};
            setChatMessages(prev => [...prev, errorMessage]);

            // Append error message to content
            setContent(prevContent => prevContent + '\n\n**Bot:** Failed to get response.');
            toast.error("Failed to get response from LLM.");
        } finally {
            setLoading(false);
        }
    };

    // Handle key press in textarea
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit();
        }
    };

    // Handle text selection for FloatingToolbar
    const handleMouseUp = (e) => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text.length > 0) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setToolbarPosition({top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width + 10}); // Slight offset
            setShowToolbar(true);
            setSelectedText(text);
        } else {
            setShowToolbar(false);
            setSelectedText('');
        }
    };

    const handleSaveClick = () => {
        if (addEntry && selectedText) {
            addEntry(selectedText, 'Content Selection'); // Providing 'Content Selection' as the source
            // Optionally remove the selection
            window.getSelection().removeAllRanges();
            setShowToolbar(false);
            setSelectedText("");
            toast.success("Content saved to Scratch Pad!");
        }
    };

    return (
        <div className="relative flex-grow p-6 overflow-y-auto flex flex-col h-full" onMouseUp={handleMouseUp}>
            {/* Content Display */}
            <div className="flex-grow mb-4">
                <h2 className="text-2xl font-semibold mb-2">{section ? section.title : 'Select a section from the left'}</h2>
                {currentPrompt && (
                    <div className="mb-4 p-2 bg-gray-200 rounded-md">
                        <strong>Prompt:</strong> {currentPrompt}
                    </div>
                )}
                {loading && <p className="text-gray-500">Loading content...</p>}
                {!loading && content && (
                    <ReactMarkdown className="prose prose-lg">
                        {content}
                    </ReactMarkdown>
                )}
            </div>

            {/* Resizable Text Area and Chat Interface */}
            {section && (
                <Split
                    className="flex flex-col h-64 mb-4"
                    sizes={[50, 50]}
                    minSize={[100, 100]}
                    gutterSize={8}
                    direction="vertical"
                    cursor="row-resize"
                    gutterClass="gutter-vertical" // Assign the gutter class for styling
                >
                    {/* User Interaction Form */}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleChatSubmit();
                    }} className="relative flex-grow p-2">
                        <label htmlFor="userInput" className="sr-only">
                            Your Input:
                        </label>
                        <textarea
                            id="userInput"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            rows={2}
                            className="w-full border border-gray-300 rounded-md p-2 pr-10 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {/* Send Icon Button */}
                        <button
                            type="button"
                            onClick={handleChatSubmit}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 focus:outline-none"
                            aria-label="Send"
                        >
                            <FaPaperPlane/>
                        </button>
                    </form>

                    {/* Chat Interface */}
                    <div className="flex-grow p-2 border-t border-gray-300">
                        <h3 className="text-lg font-medium mb-2">Chat</h3>
                        <div className="h-full overflow-y-auto mb-2 border p-2 rounded-md bg-gray-50">
                            {chatMessages.map((msg, index) => (
                                <div key={index}
                                     className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                    <div
                                        className={`inline-block px-3 py-1 rounded-md ${
                                            msg.sender === 'user'
                                                ? 'bg-blue-500 text-white'
                                                : msg.sender === 'bot'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-300 text-gray-800'
                                        }`}
                                    >
                                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef}/>
                        </div>
                    </div>
                </Split>
            )}

            {/* Floating Toolbar */}
            {showToolbar && (
                <FloatingToolbar
                    position={toolbarPosition}
                    onSave={handleSaveClick}
                />
            )}

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick
                            rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </div>
    );

    ContentPanel.propTypes = {
        section: PropTypes.object, // The currently selected section
    };
}
    export default ContentPanel;