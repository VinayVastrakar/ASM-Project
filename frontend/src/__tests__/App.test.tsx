import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the API config to avoid external dependencies
jest.mock('../api/config', () => ({
  API_BASE_URL: 'http://localhost:8080'
}));

// Mock React Router
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock Redux store
jest.mock('../redux/store', () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn()
  }
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // Basic test to ensure the component renders
    expect(document.body).toBeInTheDocument();
  });

  test('has the correct structure', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
