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
    const { addEntry } = useContext(ScratchPadContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [chatHistory, setChatHistory] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [selectedText, setSelectedText] = useState('');
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
    const contentRef = useRef(null);
    const chatEndRef = useRef(null);
    const messageInputRef = useRef(null);

    const scrollToLastUserEntry = () => {
        const contentArea = contentRef.current;
        if (contentArea) {
            const userEntries = contentArea.querySelectorAll('.user-message');
            if (userEntries.length > 0) {
                const lastUserEntry = userEntries[userEntries.length - 1];
                lastUserEntry.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // Function to build context from chat history
    const buildContext = () => {
        let context = '';
        if (section) {
            context += `Current section: ${section.title}\n`;
            context += `Section prompt: ${section.prompt}\n\n`;
        }
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
                    const initialContext = `Section: ${section.title}\nPrompt: ${section.prompt}`;
                    const response = await generateLLMContent(initialContext);
                    setContent(response);

                    // Add system message to both current messages and history
                    const systemMessage = {sender: 'system', text: response};
                    setChatMessages([systemMessage]);
                    setChatHistory(prev => [...prev, systemMessage]); // Add to history
                } catch (error) {
                    const errorMsg = "Failed to load content.";
                    setContent(errorMsg);
                    toast.error(errorMsg);
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


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleChatSubmit();
        }
    };

    const handleMouseUp = (e) => {
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text.length > 0) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setToolbarPosition({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX + rect.width + 10
            });
            setShowToolbar(true);
            setSelectedText(text);
        } else {
            setShowToolbar(false);
            setSelectedText('');
        }
    };

    const handleSaveClick = () => {
        if (addEntry && selectedText) {
            addEntry(selectedText, 'Content Selection');
            window.getSelection().removeAllRanges();
            setShowToolbar(false);
            setSelectedText("");
            toast.success("Content saved to Scratch Pad!");
        }
    };

    const renderContentMessage = (text, isUser) => (
        <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
            <div
                className={`inline-block max-w-[90%] rounded-lg px-4 py-2 ${
                    isUser ? 'bg-blue-100 text-gray-900 user-message' : 'bg-gray-100 text-gray-900'
                }`}
            >
                <div className={`${isUser ? 'text-right' : 'text-left'} mb-1 text-sm text-gray-600`}>
                    {isUser ? 'You' : 'Assistant'}
                </div>
                <ReactMarkdown className="prose max-w-none">
                    {text}
                </ReactMarkdown>
            </div>
        </div>
    );

    const renderContent = () => {
        const messages = content.split(/\*\*(You|Assistant):\*\*/g).filter(Boolean);
        return messages.map((message, index) => {
            if (message.trim() === 'You' || message.trim() === 'Assistant') return null;
            const isUser = messages[index - 1]?.trim() === 'You';
            return renderContentMessage(message.trim(), isUser);
        });
    };

    const handleChatSubmit = async () => {
        if (chatInput.trim() === '') return;

        const userMessage = { sender: 'user', text: chatInput };
        setChatMessages(prev => [...prev, userMessage]);
        setChatHistory(prev => [...prev, userMessage]);

        const newContent = content + '\n\n**You:** ' + chatInput;
        setContent(newContent);
        setChatInput('');
        setLoading(true);

        try {
            const context = buildContext();
            const fullPrompt = `${context}\n\nHuman: ${chatInput}`;
            const response = await generateLLMContent(fullPrompt);

            const botMessage = { sender: 'bot', text: response };
            setChatMessages(prev => [...prev, botMessage]);
            setChatHistory(prev => [...prev, botMessage]);

            setContent(newContent + '\n\n**Assistant:** ' + response);
            setTimeout(scrollToLastUserEntry, 100);
        } catch (error) {
            console.error("Error in chat:", error);
            toast.error("Failed to get response from LLM.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex-grow p-6 overflow-hidden flex flex-col h-full" onMouseUp={handleMouseUp}>
            <Split
                className="flex flex-col h-full"
                sizes={[60, 40]}
                minSize={[200, 100]}
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
                    <div className="chat-messages" ref={contentRef}>
                        {renderContent()}
                    </div>
                </div>

                {/* Chat History Section */}
                <div className="flex flex-col h-full bg-white border-t border-gray-200">
                    <div className="flex flex-col h-full">
                        <div className="text-lg font-semibold p-2 border-b bg-gray-50">
                            Chat History
                        </div>
                        <div className="flex-grow overflow-y-auto p-4 mb-16">
                            <div className="h-full">
                                {chatHistory.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                                    >
                                        <div
                                            className={`inline-block max-w-[90%] rounded-lg px-4 py-2 ${
                                                msg.sender === 'user'
                                                    ? 'bg-blue-100 text-gray-900'
                                                    : 'bg-gray-100 text-gray-900'
                                            }`}
                                        >
                                            <div className={`${msg.sender === 'user' ? 'text-right' : 'text-left'} mb-1 text-sm text-gray-600`}>
                                                {msg.sender === 'user' ? 'You' : 'Assistant'}
                                            </div>
                                            <ReactMarkdown className="prose max-w-none">
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
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
                </div>
            </Split>

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
