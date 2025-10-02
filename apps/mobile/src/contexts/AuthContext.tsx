import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { authService } from '../services/authService';
import { User, AuthTokens } from '../types/auth';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!tokens;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedTokens = await SecureStore.getItemAsync('auth_tokens');
      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens);
        setTokens(parsedTokens);
        
        // Verify token and get user info
        const userData = await authService.getCurrentUser(parsedTokens.accessToken);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const storeTokens = async (newTokens: AuthTokens) => {
    try {
      await SecureStore.setItemAsync('auth_tokens', JSON.stringify(newTokens));
      setTokens(newTokens);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      await storeTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const demoLogin = async () => {
    try {
      const response = await authService.demoLogin();
      setUser(response.user);
      await storeTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      console.error('Demo login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await authService.register(email, password, firstName, lastName);
      setUser(response.user);
      await storeTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_tokens');
      setUser(null);
      setTokens(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshToken = async () => {
    if (!tokens?.refreshToken) {
      await logout();
      return;
    }

    try {
      const newTokens = await authService.refreshToken(tokens.refreshToken);
      await storeTokens(newTokens);
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    demoLogin,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
