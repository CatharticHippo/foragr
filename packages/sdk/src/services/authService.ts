import { CedarlumeApiClient } from '../client.js';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TokenResponse,
  User,
} from '../types/index.js';
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  RefreshTokenRequestSchema,
  AuthResponseSchema,
  TokenResponseSchema,
  UserSchema,
} from '../types/index.js';

export class AuthService {
  constructor(private client: CedarlumeApiClient) {}

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const validatedCredentials = LoginRequestSchema.parse(credentials);
    const response = await this.client.post<AuthResponse>('/auth/login', validatedCredentials);
    return AuthResponseSchema.parse(response);
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const validatedUserData = RegisterRequestSchema.parse(userData);
    const response = await this.client.post<AuthResponse>('/auth/register', validatedUserData);
    return AuthResponseSchema.parse(response);
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const request = RefreshTokenRequestSchema.parse({ refreshToken });
    const response = await this.client.post<TokenResponse>('/auth/refresh', request);
    return TokenResponseSchema.parse(response);
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return UserSchema.parse(response);
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // OAuth methods
  getGoogleAuthUrl(): string {
    return `${this.client['config'].baseUrl}/auth/google`;
  }

  getAppleAuthUrl(): string {
    return `${this.client['config'].baseUrl}/auth/apple`;
  }
}
