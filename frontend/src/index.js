// frontend/src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ScratchPadProvider } from './context/ScratchPadContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css'; // Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ScratchPadProvider>
                <App />
            </ScratchPadProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
