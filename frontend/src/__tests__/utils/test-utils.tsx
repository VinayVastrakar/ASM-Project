import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

// Import your slices
import authSlice from '../../redux/slices/authSlice';
import assetSlice from '../../redux/slices/assetSlice';
import categorySlice from '../../redux/slices/categorySlice';
import userSlice from '../../redux/slices/userSlice';

// Create a test store
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      assets: assetSlice,
      categories: categorySlice,
      users: userSlice,
    },
    preloadedState,
  });
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </Provider>
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
