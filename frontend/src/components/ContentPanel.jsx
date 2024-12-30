// frontend/src/components/ContentPanel.jsx

import React, { useEffect, useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { generateLLMContent } from '../services/api';
import { ScratchPadContext } from '../context/ScratchPadContext';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import { FaPaperPlane } from 'react-icons/fa';
import FloatingToolbar from './FloatingToolbar';
import Split from 'react-split';

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
    const messageInputRef = useRef(null);

    // Function to build context from chat history
    const buildContext = () => {
        let context = '';

        // Add section information if available
        if (section) {
            context += `Current section: ${section.title}\n`;
            context += `Section prompt: ${section.prompt}\n\n`;
        }

        // Add chat history
        context += 'Previous conversation:\n';
        chatMessages.forEach(msg => {
            context += `${msg.sender === 'user' ? 'Human' : 'Assistant'}: ${msg.text}\n`;
        });

        return context;
    };

    useEffect(() => {
        const fetchContent = async () => {
            if (section && section.prompt) {
                setLoading(true);
                setCurrentPrompt(section.prompt);
                try {
                    // Include section context in initial prompt
                    const initialContext = `Section: ${section.title}\nPrompt: ${section.prompt}`;
                    const response = await generateLLMContent(initialContext);
                    setContent(response);

                    // Add system message to chat
                    const systemMessage = {sender: 'system', text: response};
                    setChatMessages([systemMessage]);
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
                setChatMessages([]);
            }
        };
        fetchContent();
    }, [section]);

    // Handle chat submission with context
    const handleChatSubmit = async () => {
        if (chatInput.trim() === '') return;

        // Add user message
        const userMessage = {sender: 'user', text: chatInput};
        setChatMessages(prev => [...prev, userMessage]);

        // Clear input and show loading state
        setChatInput('');
        setLoading(true);

        try {
            // Build full context for the LLM
            const context = buildContext();
            const fullPrompt = `${context}\n\nHuman: ${chatInput}`;

            // Get response from LLM with context
            const response = await generateLLMContent(fullPrompt);

            // Add bot response
            const botMessage = {sender: 'bot', text: response};
            setChatMessages(prev => [...prev, botMessage]);

            // Update content area
            setContent(prevContent => prevContent + '\n\n**You:** ' + chatInput + '\n\n**Assistant:** ' + response);
        } catch (error) {
            console.error("Error in chat:", error);
            const errorMessage = {sender: 'bot', text: "Failed to get response."};
            setChatMessages(prev => [...prev, errorMessage]);
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

    const renderChatMessage = (message, index) => {
        const isUser = message.sender === 'user';
        return (
            <div
                key={index}
                className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        isUser
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-900'
                    }`}
                >
                    <ReactMarkdown className="prose">
                        {message.text}
                    </ReactMarkdown>
                </div>
            </div>
        );
    };

    return (
        <div className="relative flex-grow p-6 overflow-hidden flex flex-col h-full" onMouseUp={handleMouseUp}>
            <Split
                className="flex flex-col h-full"
                sizes={[60, 40]} // Initial split: 60% content, 40% chat
                minSize={[200, 100]} // Minimum sizes for each panel
                direction="vertical"
                gutterSize={4}
                dragInterval={1}
            >
                {/* Main Content Area */}
                <div className="overflow-y-auto">
                    <h2 className="text-2xl font-semibold mb-2">
                        {section ? section.title : 'Select a section from the left'}
                    </h2>
                    {currentPrompt && (
                        <div className="mb-4 p-2 bg-gray-100 rounded-md">
                            <strong>Prompt:</strong> {currentPrompt}
                        </div>
                    )}
                    {loading && <p className="text-gray-500">Loading content...</p>}
                    {!loading && content && (
                        <div className="chat-messages">
                            {chatMessages.map((msg, index) => renderChatMessage(msg, index))}
                        </div>
                    )}
                </div>

                {/* Chat Interface */}
                <div className="flex flex-col h-full bg-white">
                    {/* Chat Messages */}
                    <div className="flex-grow overflow-y-auto p-4">
                        <div className="h-full">
                            {chatMessages.map((msg, index) => renderChatMessage(msg, index))}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleChatSubmit();
                        }} className="relative">
                            <textarea
                                ref={messageInputRef}
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message..."
                                className="w-full border border-gray-300 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 bottom-3 text-blue-500 hover:text-blue-600"
                                disabled={loading}
                            >
                                <FaPaperPlane className={loading ? 'opacity-50' : ''} />
                            </button>
                        </form>
                    </div>
                </div>
            </Split>

            {/* Floating Toolbar */}
            {showToolbar && (
                <FloatingToolbar
                    position={toolbarPosition}
                    onSave={handleSaveClick}
                />
            )}

            <ToastContainer />
        </div>
    );
};

ContentPanel.propTypes = {
    section: PropTypes.object,
};

export default ContentPanel;
