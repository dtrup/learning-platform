// frontend/src/context/ChatContext.jsx

import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatMessages, setChatMessages] = useState([]);

    const addMessage = (message) => {
        setChatMessages(prev => [...prev, message]);
    };

    const clearMessages = () => {
        setChatMessages([]);
    };

    return (
        <ChatContext.Provider value={{ chatMessages, addMessage, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
};
