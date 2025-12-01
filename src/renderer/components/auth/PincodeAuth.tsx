/**
 * Pincode Authentication Component
 * Handles both first-time setup and login
 */

import React, { useState } from 'react';
import './PincodeAuth.css';

interface PincodeAuthProps {
  isFirstTimeSetup: boolean;
  onAuthSuccess: () => void;
}

export const PincodeAuth: React.FC<PincodeAuthProps> = ({
  isFirstTimeSetup,
  onAuthSuccess,
}) => {
  const [pincode, setPincode] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePincodeChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '');
    // Limit to 8 digits
    setPincode(digits.slice(0, 8));
    setError('');
  };

  const handleConfirmationChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '');
    // Limit to 8 digits
    setConfirmation(digits.slice(0, 8));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate pincode length (4-8 digits)
    if (pincode.length < 4) {
      setError('Pincode must be at least 4 digits');
      return;
    }

    if (pincode.length > 8) {
      setError('Pincode must be at most 8 digits');
      return;
    }

    if (isFirstTimeSetup && !confirmation) {
      setError('Please confirm your pincode');
      return;
    }

    if (isFirstTimeSetup && pincode !== confirmation) {
      setError('Pincodes do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = {
        pincode,
        ...(isFirstTimeSetup && { confirmation }),
      };

      const result = await window.electronAPI.login(credentials);

      if (result.success) {
        onAuthSuccess();
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
      // Clear pincode fields for security
      if (!isFirstTimeSetup || error) {
        setPincode('');
        setConfirmation('');
      }
    }
  };

  return (
    <div className="pincode-auth-container">
      <div className="pincode-auth-card">
        <h1 className="pincode-auth-title">
          🔐 Pi Touch Calendar
        </h1>

        <h2 className="pincode-auth-subtitle">
          {isFirstTimeSetup ? 'First-Time Setup' : 'Enter Your Pincode'}
        </h2>

        {isFirstTimeSetup && (
          <p className="pincode-auth-instructions">
            Create a 4-8 digit pincode to secure your calendar
          </p>
        )}

        <form onSubmit={handleSubmit} className="pincode-auth-form">
          <div className="pincode-input-group">
            <label htmlFor="pincode" className="pincode-label">
              {isFirstTimeSetup ? 'Create Pincode' : 'Pincode'}
            </label>
            <input
              id="pincode"
              type="password"
              inputMode="numeric"
              value={pincode}
              onChange={(e) => handlePincodeChange(e.target.value)}
              className="pincode-input"
              placeholder="Enter 4-8 digits"
              autoFocus
              disabled={isSubmitting}
            />
            <div className="pincode-dots">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  data-testid={`pincode-dot-${i}`}
                  className={`pincode-dot ${i < pincode.length ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>

          {isFirstTimeSetup && (
            <div className="pincode-input-group">
              <label htmlFor="confirmation" className="pincode-label">
                Confirm Pincode
              </label>
              <input
                id="confirmation"
                type="password"
                inputMode="numeric"
                value={confirmation}
                onChange={(e) => handleConfirmationChange(e.target.value)}
                className="pincode-input"
                placeholder="Re-enter pincode"
                disabled={isSubmitting}
              />
              <div className="pincode-dots">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    data-testid={`confirmation-dot-${i}`}
                    className={`pincode-dot ${i < confirmation.length ? 'filled' : ''}`}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="pincode-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="pincode-submit-btn"
            disabled={isSubmitting || pincode.length < 4}
          >
            {isSubmitting ? 'Processing...' : isFirstTimeSetup ? 'Create Pincode' : 'Login'}
          </button>
        </form>

        <div className="pincode-help">
          <p>Need help? Contact your administrator</p>
        </div>
      </div>
    </div>
  );
};
