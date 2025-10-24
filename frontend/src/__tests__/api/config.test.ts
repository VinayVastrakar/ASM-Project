import { API_BASE_URL } from '../../api/config';

describe('API Configuration', () => {
  test('should have API_BASE_URL defined', () => {
    expect(API_BASE_URL).toBeDefined();
    expect(typeof API_BASE_URL).toBe('string');
  });

  test('should have valid API base URL format', () => {
    // Check if it's a valid URL format
    expect(API_BASE_URL).toMatch(/^https?:\/\//);
  });
});
