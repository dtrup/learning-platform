// frontend/src/components/ScratchPad.jsx

import React, { useContext } from 'react';
import { ScratchPadContext } from '../context/ScratchPadContext';
import { format, parseISO, isValid } from 'date-fns';

const ScratchPad = () => {
    const { entries, deleteEntry, updateNotes } = useContext(ScratchPadContext);

    // Group entries by date
    const groupedEntries = entries.reduce((groups, entry) => {
        let date;
        try {
            const parsedDate = parseISO(entry.timestamp);
            if (isValid(parsedDate)) {
                date = format(parsedDate, 'yyyy-MM-dd');
            } else {
                throw new Error('Invalid date');
            }
        } catch (error) {
            console.error(`Invalid timestamp for entry ID ${entry.id}:`, entry.timestamp);
            date = 'Unknown Date';
        }

        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(entry);
        return groups;
    }, {});

    // Export entries to TXT with delimiters
    const exportToTxt = () => {
        let txtContent = '';
        Object.keys(groupedEntries).sort((a, b) => {
            if (a === 'Unknown Date') return 1;
            if (b === 'Unknown Date') return -1;
            return new Date(b) - new Date(a);
        }).forEach(date => {
            txtContent += `Date: ${date !== 'Unknown Date' ? format(new Date(date), 'MMMM dd, yyyy') : 'Unknown Date'}\n`;
            groupedEntries[date].forEach(entry => {
                txtContent += `  Time: ${date !== 'Unknown Date' ? format(new Date(entry.timestamp), 'hh:mm a') : 'N/A'}\n`;
                txtContent += `  Text: ${entry.text}\n`;
                txtContent += `  Source: ${entry.source}\n`;
                txtContent += `  Notes: ${entry.notes}\n`;
                txtContent += `\n`;
            });
        });

        const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute('download', 'scratch_pad_entries.txt');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-50 w-full h-full p-4 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-300">
            <h2 className="text-xl font-semibold mb-4">Scratch Pad</h2>
            <button
                onClick={exportToTxt}
                className="mb-4 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-200"
            >
                Export to TXT
            </button>
            <div>
                {Object.keys(groupedEntries).sort((a, b) => {
                    if (a === 'Unknown Date') return 1;
                    if (b === 'Unknown Date') return -1;
                    return new Date(b) - new Date(a);
                }).map(date => (
                    <div key={date} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">
                            {date !== 'Unknown Date' ? format(new Date(date), 'MMMM dd, yyyy') : 'Unknown Date'}
                        </h3>
                        <ul>
                            {groupedEntries[date].map(entry => (
                                <li key={entry.id} className="mb-4 p-2 bg-white rounded-md shadow-sm">
                                    {date !== 'Unknown Date' && (
                                        <p className="text-sm text-gray-500">{format(new Date(entry.timestamp), 'hh:mm a')}</p>
                                    )}
                                    <p className="text-gray-800 mt-1"><strong>Text:</strong> {entry.text}</p>
                                    <p className="text-gray-800 mt-1"><strong>Source:</strong> {entry.source}</p>
                                    <textarea
                                        placeholder="Add notes..."
                                        value={entry.notes}
                                        onChange={(e) => updateNotes(entry.id, e.target.value)}
                                        className="w-full mt-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="mt-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScratchPad;
