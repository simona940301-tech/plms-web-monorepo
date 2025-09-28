
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeTheme } from './lib/theme';
import { initializeUtm } from './lib/utm';
import { initializeGTM } from './lib/gtm';
import { initializeSpaTracking } from './lib/spa';

initializeTheme();
initializeUtm();
initializeGTM();
initializeSpaTracking();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
