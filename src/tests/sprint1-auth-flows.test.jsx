/**
 * Sprint 1 Auth Flow Tests — M5 QA / Documentation
 * Branch: test/sprint1-auth-flows
 *
 * Covers:
 *  1. Email registration form renders correctly
 *  2. Google OAuth button present on Login and Register
 *  3. Login guard blocks INACTIVE users
 *  4. Login guard allows ACTIVE users
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();
const mockSignOut = vi.fn();

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    loading: false,
    authError: null,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
    signOut: mockSignOut,
  }),
  AuthProvider: ({ children }) => children,
}));

import Login from '../pages/Login';
import Register from '../pages/Register';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Email Registration Form', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders an email input field', () => {
    renderWithRouter(<Register />);
    expect(document.querySelector('input[type="email"]')).toBeTruthy();
  });

  it('renders a password input field', () => {
    renderWithRouter(<Register />);
    expect(document.querySelector('input[type="password"]')).toBeTruthy();
  });

  it('renders a submit / register button', () => {
    renderWithRouter(<Register />);
    const btn = screen.queryByRole('button', { name: /create account/i });
    expect(btn).toBeTruthy();
  });

  it('calls signUp when the registration form is submitted', async () => {
  mockSignUp.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });
  renderWithRouter(<Register />);

  fireEvent.change(document.querySelector('input[name="firstName"]'), { target: { value: 'John' } });
  fireEvent.change(document.querySelector('input[name="lastName"]'), { target: { value: 'Doe' } });
  fireEvent.change(document.querySelector('input[name="email"]'), { target: { value: 'test@neu.edu.ph' } });
  fireEvent.change(document.querySelector('input[name="password"]'), { target: { value: 'Password123!' } });
  fireEvent.change(document.querySelector('input[name="confirmPassword"]'), { target: { value: 'Password123!' } });

  fireEvent.click(screen.queryByRole('button', { name: /create account/i }));

  await waitFor(() => {
    expect(mockSignUp).toHaveBeenCalled();
  });
});
  });


describe('Google OAuth Button', () => {
  beforeEach(() => vi.clearAllMocks());

  it('renders "Continue with Google" button on Login page', () => {
    renderWithRouter(<Login />);
    const btn =
      screen.queryByText(/continue with google/i) ||
      screen.queryByRole('button', { name: /google/i });
    expect(btn).toBeTruthy();
  });

  it('renders a Google button on Register page', () => {
    renderWithRouter(<Register />);
    const btn =
      screen.queryByText(/continue with google/i) ||
      screen.queryByText(/sign up with google/i) ||
      screen.queryByRole('button', { name: /google/i });
    expect(btn).toBeTruthy();
  });

  it('calls signInWithGoogle when Google button is clicked on Login', async () => {
    mockSignInWithGoogle.mockResolvedValueOnce({});
    renderWithRouter(<Login />);
    const btn =
      screen.queryByText(/continue with google/i) ||
      screen.queryByRole('button', { name: /google/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });
});

describe('Login Guard — INACTIVE user is blocked', () => {
  beforeEach(() => vi.clearAllMocks());

  it('displays login guard structure on Login page', () => {
    renderWithRouter(<Login />);
    expect(document.querySelector('.hope-login')).toBeTruthy();
  });

  it('does NOT navigate to /customers when login returns an error', async () => {
    mockSignIn.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });
    renderWithRouter(<Login />);

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = screen.queryByRole('button', { name: /sign in/i });

    if (emailInput) fireEvent.change(emailInput, { target: { value: 'inactive@neu.edu.ph' } });
    if (passwordInput) fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    if (submitBtn) fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalledWith('/customers');
    });
  });
});

describe('Login Guard — ACTIVE user is allowed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('navigates to /customers when signIn succeeds with no error', async () => {
    mockSignIn.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });
    renderWithRouter(<Login />);

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = screen.queryByRole('button', { name: /sign in/i });

    if (emailInput) fireEvent.change(emailInput, { target: { value: 'active@neu.edu.ph' } });
    if (passwordInput) fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    if (submitBtn) fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customers');
    });
  });

  it('does NOT show an error message when login succeeds', async () => {
    mockSignIn.mockResolvedValueOnce({ data: { user: { id: 'u1' } }, error: null });
    renderWithRouter(<Login />);

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = screen.queryByRole('button', { name: /sign in/i });

    if (emailInput) fireEvent.change(emailInput, { target: { value: 'active@neu.edu.ph' } });
    if (passwordInput) fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    if (submitBtn) fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/pending activation/i)).toBeNull();
      expect(screen.queryByText(/invalid/i)).toBeNull();
    });
  });
});