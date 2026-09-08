import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';

describe('Auth Forms Rendering Suite', () => {
  it('renders login input fields and submit button correctly', () => {
    render(<LoginForm onSwitch={() => {}} onLoginSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders register fields and submission button correctly', () => {
    render(<RegisterForm onSwitch={() => {}} onRegisterSuccess={() => {}} />);
    expect(screen.getByPlaceholderText(/choose a username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });
});
