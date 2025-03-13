// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Import React at the top level
import React from 'react';

// Mock implementation for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver which might be used by some components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Simple mock for react-router-dom components
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <>{children}</>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Outlet: () => <div>Outlet content</div>,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Silence console errors during tests
jest.spyOn(console, 'error').mockImplementation(() => {});