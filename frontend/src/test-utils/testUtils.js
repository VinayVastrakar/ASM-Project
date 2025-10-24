import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock Redux store
const mockStore = {
  getState: () => ({}),
  dispatch: jest.fn(),
  subscribe: jest.fn()
};

// Mock Provider component
const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="mock-provider">{children}</div>
);

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: any;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = mockStore,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </MockProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock user for testing
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER'
};

// Mock asset for testing
export const mockAsset = {
  id: 1,
  name: 'Test Asset',
  description: 'Test Description',
  category: 'Electronics',
  purchaseDate: '2023-01-01',
  purchasePrice: 1000,
  currentValue: 800
};

// Mock category for testing
export const mockCategory = {
  id: 1,
  name: 'Electronics',
  description: 'Electronic devices and equipment'
};
