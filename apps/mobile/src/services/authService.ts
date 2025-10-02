import { API_BASE_URL } from '../config/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

class AuthService {
  private baseUrl = `${API_BASE_URL}/auth`;

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  }

  async register(email: string, password: string, firstName: string, lastName: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await fetch(`${this.baseUrl}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  }

  async getCurrentUser(accessToken: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  async logout(accessToken: string): Promise<void> {
    await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Demo login method for development/demo purposes
  async demoLogin(): Promise<AuthResponse> {
    // Return mock auth response for demo
    return {
      accessToken: 'demo_access_token_12345',
      refreshToken: 'demo_refresh_token_12345',
      user: {
        id: 'demo_user_1',
        email: 'demo@cedarlume.com',
        firstName: 'Demo',
        lastName: 'User',
        profileImageUrl: 'https://example.com/demo-profile.jpg',
        bio: 'Demo user for showcasing the Cedarlume Marketplace app',
        skills: ['Leadership', 'Communication', 'Event Planning'],
        interests: ['Environment', 'Education', 'Community Service'],
        location: 'Los Angeles, CA',
        phoneNumber: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    };
  }
}

export const authService = new AuthService();
