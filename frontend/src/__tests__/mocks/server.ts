import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW server for testing
export const server = setupServer(...handlers);

// Setup and teardown for tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
