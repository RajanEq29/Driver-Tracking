import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi, LoginRequest } from '../api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest): Promise<boolean> => {
    set({ isLoading: true, error: null });
    try {
      const response = await loginApi(credentials);
      await AsyncStorage.setItem('auth_token', response.token);
      set({ token: response.token, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error || 'Login failed. Please try again.';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('auth_token');
    set({ token: null, isAuthenticated: false, error: null });
  },

  restoreToken: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));
