# Frontend Test Directory

This directory contains all test files for the frontend application, organized by feature and functionality.

## Directory Structure

```
src/__tests__/
├── api/                    # API service tests
│   ├── asset.api.test.ts
│   └── config.test.ts
├── components/             # Component tests
│   ├── common/            # Common components
│   │   └── Alert.test.tsx
│   ├── auth/              # Authentication components
│   ├── asset/             # Asset management components
│   └── user/              # User management components
├── redux/                 # Redux store tests
│   └── slices/
│       └── authSlice.test.ts
├── utils/                 # Utility function tests
│   └── imageOptimization.test.ts
├── mocks/                 # Mock data and handlers
│   ├── handlers.ts        # MSW API handlers
│   └── server.ts         # MSW server setup
├── utils/                 # Test utilities
│   └── test-utils.tsx     # Custom render functions
├── setup.ts              # Test setup configuration
└── README.md             # This file
```

## Test Categories

### 1. **Component Tests** (`components/`)
- Test React components in isolation
- Mock external dependencies
- Test user interactions and rendering

### 2. **API Tests** (`api/`)
- Test API service functions
- Mock HTTP requests
- Test error handling

### 3. **Redux Tests** (`redux/`)
- Test Redux slices and actions
- Test state management logic
- Test async actions

### 4. **Utility Tests** (`utils/`)
- Test helper functions
- Test data transformation logic
- Test validation functions

## Test Utilities

### Custom Render Function
```typescript
import { renderWithProviders } from '../utils/test-utils';

test('renders component', () => {
  renderWithProviders(<MyComponent />);
  // Test assertions
});
```

### Mock Data
```typescript
import { mockUser, mockAsset } from '../utils/test-utils';
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- App.test.tsx
```

## Best Practices

1. **Test Structure**: Use describe blocks to group related tests
2. **Mocking**: Mock external dependencies and API calls
3. **Assertions**: Use specific assertions for better error messages
4. **Cleanup**: Clean up after each test to avoid side effects
5. **Coverage**: Aim for meaningful test coverage, not just high percentages

## Adding New Tests

1. Create test files in the appropriate directory
2. Follow the naming convention: `*.test.ts` or `*.test.tsx`
3. Import necessary testing utilities
4. Write descriptive test names
5. Mock external dependencies
6. Test both happy path and error scenarios
