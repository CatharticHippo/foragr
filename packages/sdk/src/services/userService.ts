import { z } from 'zod';
import { CedarlumeApiClient } from '../client';
import {
  User,
  UserSchema,
  UserStats,
  UserStatsSchema,
  UserBadge,
  UserBadgeSchema,
  XpEvent,
  UpdateUserRequest,
  UpdateUserRequestSchema,
  PaginatedResponse,
} from '../types';

export class UserService {
  constructor(private client: CedarlumeApiClient) {}

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return UserSchema.parse(response);
  }

  async updateProfile(userData: UpdateUserRequest): Promise<User> {
    const validatedUserData = UpdateUserRequestSchema.parse(userData);
    const response = await this.client.patch<User>('/users/me', validatedUserData);
    return UserSchema.parse(response);
  }

  async getUserStats(): Promise<UserStats> {
    const response = await this.client.get<UserStats>('/users/me/stats');
    return UserStatsSchema.parse(response);
  }

  async getUserBadges(): Promise<UserBadge[]> {
    const response = await this.client.get<UserBadge[]>('/users/me/badges');
    return z.array(UserBadgeSchema).parse(response);
  }

  async getXpHistory(limit = 50, offset = 0): Promise<PaginatedResponse<XpEvent>> {
    const response = await this.client.get<PaginatedResponse<XpEvent>>('/users/me/xp-history', {
      limit,
      offset,
    });
    return response;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await this.client.get<User>(`/users/${userId}`);
    return UserSchema.parse(response);
  }

  async getUserStatsById(userId: string): Promise<UserStats> {
    const response = await this.client.get<UserStats>(`/users/${userId}/stats`);
    return UserStatsSchema.parse(response);
  }

  async getUserBadgesById(userId: string): Promise<UserBadge[]> {
    const response = await this.client.get<UserBadge[]>(`/users/${userId}/badges`);
    return z.array(UserBadgeSchema).parse(response);
  }
}
