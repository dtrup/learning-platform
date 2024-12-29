// frontend/src/context/ScratchPadContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed

export const ScratchPadContext = createContext();

export const ScratchPadProvider = ({ children }) => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const savedEntries = JSON.parse(localStorage.getItem('scratchPadEntries')) || [];
        setEntries(savedEntries);
    }, []);

    const addEntry = (text, source) => {
        const newEntry = {
            id: uuidv4(),
            text,
            timestamp: new Date().toISOString(), // Ensure ISO string
            source,
            notes: '',
        };
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('scratchPadEntries', JSON.stringify(updatedEntries));
    };

    const deleteEntry = (id) => {
        const updatedEntries = entries.filter(entry => entry.id !== id);
        setEntries(updatedEntries);
        localStorage.setItem('scratchPadEntries', JSON.stringify(updatedEntries));
    };

    const updateNotes = (id, notes) => {
        const updatedEntries = entries.map(entry => {
            if (entry.id === id) {
                return { ...entry, notes };
            }
            return entry;
        });
        setEntries(updatedEntries);
        localStorage.setItem('scratchPadEntries', JSON.stringify(updatedEntries));
    };

    const exportEntries = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "scratch_pad_entries.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <ScratchPadContext.Provider value={{ entries, addEntry, deleteEntry, updateNotes, exportEntries }}>
            {children}
        </ScratchPadContext.Provider>
    );
};
