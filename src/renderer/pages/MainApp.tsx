/**
 * Main Application Page
 * Displayed after successful authentication
 * Placeholder for calendar, tasks, and other features
 */

import React from 'react';
import './MainApp.css';

interface MainAppProps {
  onLogout: () => void;
}

export const MainApp: React.FC<MainAppProps> = ({ onLogout }) => {
  return (
    <div className="main-app-container">
      <header className="main-app-header">
        <h1 className="main-app-title">📅 Pi Touch Calendar</h1>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="main-app-content">
        <div className="welcome-card">
          <h2>Welcome!</h2>
          <p>Authentication successful. The main application will be implemented in Phase 2+.</p>

          <div className="feature-list">
            <h3>Upcoming Features:</h3>
            <ul>
              <li>📅 Google Calendar Integration</li>
              <li>✅ Google Sheets Chore Management</li>
              <li>🎁 Reward System</li>
              <li>👤 Profile Management</li>
              <li>📊 Progress Tracking</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
