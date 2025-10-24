import { rest } from 'msw';

// Mock API handlers for testing
export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
        token: 'mock-jwt-token'
      })
    );
  }),

  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(
      ctx.json({
        user: { id: 2, email: 'newuser@example.com', name: 'New User' },
        token: 'mock-jwt-token'
      })
    );
  }),

  // Asset endpoints
  rest.get('/api/assets', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Test Asset 1', category: 'Electronics' },
        { id: 2, name: 'Test Asset 2', category: 'Furniture' }
      ])
    );
  }),

  rest.post('/api/assets', (req, res, ctx) => {
    return res(
      ctx.json({ id: 3, name: 'New Asset', category: 'Test' })
    );
  }),

  // Category endpoints
  rest.get('/api/categories', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, name: 'Electronics' },
        { id: 2, name: 'Furniture' }
      ])
    );
  }),

  // User endpoints
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, email: 'admin@example.com', role: 'ADMIN' },
        { id: 2, email: 'user@example.com', role: 'USER' }
      ])
    );
  }),
];
