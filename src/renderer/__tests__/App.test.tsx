/**
 * App Component Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('App Component', () => {
  let mockCheckSession: ReturnType<typeof vi.fn>;
  let mockLogin: ReturnType<typeof vi.fn>;
  let mockLogout: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockCheckSession = vi.fn();
    mockLogin = vi.fn();
    mockLogout = vi.fn();

    // Mock window.electronAPI
    global.window.electronAPI = {
      checkSession: mockCheckSession,
      login: mockLogin,
      logout: mockLogout,
    };
  });

  describe('Initial Load', () => {
    it('should show loading state initially', () => {
      mockCheckSession.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<App />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should check session on mount', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });

      render(<App />);

      await waitFor(() => {
        expect(mockCheckSession).toHaveBeenCalled();
      });
    });
  });

  describe('First-Time Setup Flow', () => {
    it('should show first-time setup when no pincode exists', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: true });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('First-Time Setup')).toBeInTheDocument();
        expect(screen.getByText('Create a 4-8 digit pincode to secure your calendar')).toBeInTheDocument();
      });
    });

    it('should transition to main app after successful setup', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: true });
      mockLogin.mockResolvedValue({
        success: true,
        message: 'Pincode created successfully.',
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('First-Time Setup')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Create Pincode');
      const confirmationInput = screen.getByLabelText('Confirm Pincode');
      const submitButton = screen.getByRole('button', { name: /create pincode/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.type(confirmationInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText(/authentication successful/i)).toBeInTheDocument();
      });
    });
  });

  describe('Normal Login Flow', () => {
    it('should show login when pincode exists', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
        expect(screen.getByLabelText('Pincode')).toBeInTheDocument();
      });
    });

    it('should transition to main app after successful login', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });
      mockLogin.mockResolvedValue({
        success: true,
        message: 'Authentication successful.',
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText(/authentication successful/i)).toBeInTheDocument();
      });
    });

    it('should stay on login screen when authentication fails', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });
      mockLogin.mockResolvedValue({
        success: false,
        message: 'Incorrect pincode',
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '9999');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Incorrect pincode')).toBeInTheDocument();
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
        expect(screen.queryByText('Welcome!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Main App', () => {
    beforeEach(async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });
      mockLogin.mockResolvedValue({
        success: true,
        message: 'Authentication successful.',
      });
    });

    it('should show main app after successful authentication', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
        expect(screen.getByText('📅 Pi Touch Calendar')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
      });
    });

    it('should handle logout and return to login screen', async () => {
      mockLogout.mockResolvedValue({ success: true });

      render(<App />);

      // Login first
      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
      });

      // Now logout
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await userEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
        expect(screen.queryByText('Welcome!')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle checkSession errors gracefully', async () => {
      mockCheckSession.mockRejectedValue(new Error('Network error'));

      render(<App />);

      await waitFor(() => {
        // Should show login screen as fallback
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });
    });

    it('should handle logout errors gracefully', async () => {
      mockCheckSession.mockResolvedValue({ isFirstTimeSetup: false });
      mockLogin.mockResolvedValue({ success: true });
      mockLogout.mockRejectedValue(new Error('Logout failed'));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<App />);

      // Login first
      await waitFor(() => {
        expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      });

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Welcome!')).toBeInTheDocument();
      });

      // Attempt logout
      const logoutButton = screen.getByRole('button', { name: /logout/i });
      await userEvent.click(logoutButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });
});
