/**
 * PincodeAuth Component Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PincodeAuth } from '../PincodeAuth';

describe('PincodeAuth Component', () => {
  let mockOnAuthSuccess: ReturnType<typeof vi.fn>;
  let mockLogin: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnAuthSuccess = vi.fn();
    mockLogin = vi.fn();

    // Mock window.electronAPI
    global.window.electronAPI = {
      login: mockLogin,
      logout: vi.fn(),
      checkSession: vi.fn(),
    };
  });

  describe('First-Time Setup Mode', () => {
    it('should render first-time setup UI', () => {
      render(
        <PincodeAuth isFirstTimeSetup={true} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(screen.getByText('First-Time Setup')).toBeInTheDocument();
      expect(screen.getByText('Create a 4-8 digit pincode to secure your calendar')).toBeInTheDocument();
      expect(screen.getByLabelText('Create Pincode')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Pincode')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create pincode/i })).toBeInTheDocument();
    });

    it('should show confirmation field in first-time setup', () => {
      render(
        <PincodeAuth isFirstTimeSetup={true} onAuthSuccess={mockOnAuthSuccess} />
      );

      const confirmationInput = screen.getByLabelText('Confirm Pincode');
      expect(confirmationInput).toBeInTheDocument();
    });

    it('should successfully create pincode when pincodes match', async () => {
      mockLogin.mockResolvedValue({
        success: true,
        message: 'Pincode created successfully.',
      });

      render(
        <PincodeAuth isFirstTimeSetup={true} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Create Pincode');
      const confirmationInput = screen.getByLabelText('Confirm Pincode');
      const submitButton = screen.getByRole('button', { name: /create pincode/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.type(confirmationInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          pincode: '1234',
          confirmation: '1234',
        });
        expect(mockOnAuthSuccess).toHaveBeenCalled();
      });
    });

    it('should show error when pincodes do not match', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={true} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Create Pincode');
      const confirmationInput = screen.getByLabelText('Confirm Pincode');
      const submitButton = screen.getByRole('button', { name: /create pincode/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.type(confirmationInput, '5678');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Pincodes do not match')).toBeInTheDocument();
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });

    it('should show error when confirmation is missing', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={true} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Create Pincode');
      const submitButton = screen.getByRole('button', { name: /create pincode/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Please confirm your pincode')).toBeInTheDocument();
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe('Login Mode', () => {
    it('should render login UI', () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(screen.getByText('Enter Your Pincode')).toBeInTheDocument();
      expect(screen.getByLabelText('Pincode')).toBeInTheDocument();
      expect(screen.queryByLabelText('Confirm Pincode')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should not show confirmation field in login mode', () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      expect(screen.queryByLabelText('Confirm Pincode')).not.toBeInTheDocument();
    });

    it('should successfully authenticate with correct pincode', async () => {
      mockLogin.mockResolvedValue({
        success: true,
        message: 'Authentication successful.',
      });

      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          pincode: '1234',
        });
        expect(mockOnAuthSuccess).toHaveBeenCalled();
      });
    });

    it('should show error when authentication fails', async () => {
      mockLogin.mockResolvedValue({
        success: false,
        message: 'Incorrect pincode',
      });

      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '9999');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Incorrect pincode')).toBeInTheDocument();
        expect(mockOnAuthSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe('Pincode Validation', () => {
    it('should only accept numeric input', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode') as HTMLInputElement;

      await userEvent.type(pincodeInput, 'abc123def');

      expect(pincodeInput.value).toBe('123');
    });

    it('should limit pincode to 8 digits', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode') as HTMLInputElement;

      await userEvent.type(pincodeInput, '123456789012345');

      expect(pincodeInput.value).toBe('12345678');
    });

    it('should show error when pincode is less than 4 digits', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const form = pincodeInput.closest('form');

      await userEvent.type(pincodeInput, '123');

      // Submit the form directly since button is disabled
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(screen.getByText('Pincode must be at least 4 digits')).toBeInTheDocument();
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });

    it('should disable submit button when pincode is less than 4 digits', () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const submitButton = screen.getByRole('button', { name: /login/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when pincode is 4+ digits', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');

      expect(submitButton).not.toBeDisabled();
    });
  });

  describe('Visual Feedback', () => {
    it('should show filled dots for entered digits', async () => {
      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');

      await userEvent.type(pincodeInput, '123');

      const dot0 = screen.getByTestId('pincode-dot-0');
      const dot1 = screen.getByTestId('pincode-dot-1');
      const dot2 = screen.getByTestId('pincode-dot-2');
      const dot3 = screen.getByTestId('pincode-dot-3');

      expect(dot0.classList.contains('filled')).toBe(true);
      expect(dot1.classList.contains('filled')).toBe(true);
      expect(dot2.classList.contains('filled')).toBe(true);
      expect(dot3.classList.contains('filled')).toBe(false);
    });

    it('should show processing state when submitting', async () => {
      mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ success: true }), 100)));

      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(mockOnAuthSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      mockLogin.mockRejectedValue(new Error('Network error'));

      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument();
        expect(mockOnAuthSuccess).not.toHaveBeenCalled();
      });
    });

    it('should clear error when user starts typing', async () => {
      mockLogin.mockResolvedValue({
        success: false,
        message: 'Incorrect pincode',
      });

      render(
        <PincodeAuth isFirstTimeSetup={false} onAuthSuccess={mockOnAuthSuccess} />
      );

      const pincodeInput = screen.getByLabelText('Pincode');
      const submitButton = screen.getByRole('button', { name: /login/i });

      await userEvent.type(pincodeInput, '1234');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Incorrect pincode')).toBeInTheDocument();
      });

      await userEvent.clear(pincodeInput);
      await userEvent.type(pincodeInput, '5');

      expect(screen.queryByText('Incorrect pincode')).not.toBeInTheDocument();
    });
  });
});
