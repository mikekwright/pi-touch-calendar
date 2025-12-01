/**
 * Main App Component
 * Root component that handles auth state and routing
 */

import React, { useState, useEffect } from 'react';
import { PincodeAuth } from './components/auth/PincodeAuth';
import { MainApp } from './pages/MainApp';

interface AuthState {
  isAuthenticated: boolean;
  isFirstTimeSetup: boolean;
  isLoading: boolean;
}

export const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isFirstTimeSetup: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await window.electronAPI.checkSession();
      setAuthState({
        isAuthenticated: false,
        isFirstTimeSetup: result.isFirstTimeSetup,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setAuthState({
        isAuthenticated: false,
        isFirstTimeSetup: false,
        isLoading: false,
      });
    }
  };

  const handleAuthSuccess = () => {
    setAuthState({
      isAuthenticated: true,
      isFirstTimeSetup: false,
      isLoading: false,
    });
  };

  const handleLogout = async () => {
    try {
      await window.electronAPI.logout();
      setAuthState({
        isAuthenticated: false,
        isFirstTimeSetup: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <PincodeAuth
        isFirstTimeSetup={authState.isFirstTimeSetup}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return <MainApp onLogout={handleLogout} />;
};
