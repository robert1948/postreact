import React from 'react';
import ReactDOM from 'react-dom/client';

// Import fonts
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';

// Import Bootstrap CSS and Icons (before our custom CSS)
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import our custom CSS (after Bootstrap to override Bootstrap styles if needed)
import './index.css';
import './animations.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);