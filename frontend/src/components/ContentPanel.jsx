// frontend/src/components/ContentPanel.jsx

import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { generateLLMContent } from '../services/api';
import { ScratchPadContext } from '../context/ScratchPadContext';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContentPanel = ({ section }) => {
    const { addEntry } = useContext(ScratchPadContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            if (section && section.prompt) {
                setLoading(true);
                setCurrentPrompt(section.prompt);
                try {
                    const response = await generateLLMContent(section.prompt);
                    setContent(response);

                    // Add system message to chat
                    const systemMessage = { sender: 'system', text: response };
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

    // Handle chat submission
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (chatInput.trim() === '') return;

        // Add user message
        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);

        // Clear the input field
        setChatInput('');

        // Generate response from LLM
        setLoading(true);
        try {
            const response = await generateLLMContent(chatInput);
            const botMessage = { sender: 'bot', text: response };
            setChatMessages(prev => [...prev, botMessage]);

            // Optionally, append bot response to content
            setContent(prevContent => prevContent + '\n\n' + response);
        } catch (error) {
            console.error("Error in chat:", error);
            const errorMessage = { sender: 'bot', text: "Failed to get response." };
            setChatMessages(prev => [...prev, errorMessage]);
            toast.error("Failed to get response from LLM.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex-grow p-6 overflow-y-auto flex flex-col h-full">
            {/* Content Display */}
            <div>
                <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                {currentPrompt && (
                    <div className="mb-4 p-2 bg-gray-200 rounded-md">
                        <strong>Prompt:</strong> {currentPrompt}
                    </div>
                )}
                {loading && <p className="text-gray-500">Loading content...</p>}
                {!loading && (
                    <ReactMarkdown className="prose prose-lg">
                        {content}
                    </ReactMarkdown>
                )}
            </div>

            {/* Chat Interface */}
            <div className="mt-auto">
                <h3 className="text-lg font-medium mb-2">Chat</h3>
                <div className="max-h-64 overflow-y-auto mb-4 border p-2 rounded-md bg-gray-50">
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-3 py-1 rounded-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : msg.sender === 'bot' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                handleChatSubmit(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
                    >
                        Send
                    </button>
                </form>
            </div>

            {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>)
};

ContentPanel.propTypes = {
    section: PropTypes.object, // The currently selected section
};

export default ContentPanel;
