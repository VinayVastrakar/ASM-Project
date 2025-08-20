import api from './config';

export const googleAuthApi = {
  login: async (idToken: string) => {
    const response = await api.post('/api/auth/google-login', { idToken });
    return response.data;
  },
};
