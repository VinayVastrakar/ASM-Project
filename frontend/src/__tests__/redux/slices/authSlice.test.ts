import authSlice, { login, logout } from '../../redux/slices/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  };

  test('should return the initial state', () => {
    expect(authSlice(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('should handle login pending', () => {
    const action = { type: login.pending.type };
    const state = authSlice(initialState, action);
    expect(state.loading).toBe(true);
  });

  test('should handle login fulfilled', () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    const mockToken = 'mock-jwt-token';
    const action = {
      type: login.fulfilled.type,
      payload: { user: mockUser, token: mockToken }
    };
    const state = authSlice(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('should handle logout', () => {
    const stateWithUser = {
      ...initialState,
      user: { id: 1, email: 'test@example.com' },
      token: 'mock-token',
      isAuthenticated: true
    };
    const state = authSlice(stateWithUser, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
