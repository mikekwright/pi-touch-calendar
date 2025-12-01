/**
 * Renderer process entry point
 * This file is loaded by index.html and initializes the React application
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/globals.css';

// Mount React application
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element. Ensure index.html has <div id="root"></div>');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
