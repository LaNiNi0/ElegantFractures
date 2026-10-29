import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
import './theme-seol.css';
import './photos.css';
import './player-settings.css';
import './news.css';
import './calendar.css';
import './map.css';
import './contact-profile.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
