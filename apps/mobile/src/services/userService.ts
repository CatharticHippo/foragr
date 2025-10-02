import { apiClient } from '../config/api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  location?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalXp: number;
  totalHours: number;
  badgeCount: number;
  level: number;
  completedListings: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  totalDonations: number;
  impactScore: number;
  status: 'MEMBER' | 'VOLUNTEER' | 'DONOR';
  nextLevelAt: number;
}

export interface UserProfile {
  user: User;
  stats: UserStats;
  recentActivity: Activity[];
  badges: Badge[];
  achievements: Achievement[];
}

export interface Activity {
  id: string;
  type: 'listing_completed' | 'badge_earned' | 'level_up' | 'donation_made';
  title: string;
  description: string;
  xpEarned?: number;
  date: string;
  listingId?: string;
  badgeId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
  xpValue: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  completedAt?: string;
  xpReward: number;
}

export const userService = {
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Return mock data for development
      return getMockUser();
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put('/users/me', updates);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await apiClient.get('/users/me/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Return mock data for development
      return getMockUserStats();
    }
  },

  async getUserProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/users/me/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Return mock data for development
      return getMockUserProfile();
    }
  },

  async getUserActivity(limit = 10): Promise<Activity[]> {
    try {
      const response = await apiClient.get(`/users/me/activity?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      // Return mock data for development
      return getMockActivities();
    }
  },

  async getUserBadges(): Promise<Badge[]> {
    try {
      const response = await apiClient.get('/users/me/badges');
      return response.data;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      // Return mock data for development
      return getMockBadges();
    }
  },

  async getUserAchievements(): Promise<Achievement[]> {
    try {
      const response = await apiClient.get('/users/me/achievements');
      return response.data;
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      // Return mock data for development
      return getMockAchievements();
    }
  },

  async uploadProfileImage(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await apiClient.post('/users/me/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      await apiClient.delete('/users/me');
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  },
};

// Mock data for development
function getMockUser(): User {
  return {
    id: 'user1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: 'https://example.com/profile.jpg',
    bio: 'Passionate about making a difference in my community through volunteer work.',
    skills: ['Leadership', 'Communication', 'Event Planning'],
    interests: ['Environment', 'Education', 'Community Service'],
    location: 'Los Angeles, CA',
    phoneNumber: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    isVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };
}

function getMockUserStats(): UserStats {
  return {
    totalXp: 2450,
    totalHours: 48,
    badgeCount: 12,
    level: 8,
    completedListings: 15,
    currentStreak: 3,
    longestStreak: 7,
    favoriteCategory: 'Environment',
    totalDonations: 150,
    impactScore: 89,
    status: 'VOLUNTEER',
    nextLevelAt: 3000,
  };
}

function getMockActivities(): Activity[] {
  return [
    {
      id: '1',
      type: 'listing_completed',
      title: 'Beach Cleanup Completed',
      description: 'Successfully completed beach cleanup at Santa Monica',
      xpEarned: 150,
      date: '2024-01-10T14:30:00Z',
      listingId: '1',
    },
    {
      id: '2',
      type: 'badge_earned',
      title: 'Eco Warrior Badge',
      description: 'Earned for completing 5 environmental volunteer activities',
      xpEarned: 100,
      date: '2024-01-08T10:15:00Z',
      badgeId: 'badge1',
    },
    {
      id: '3',
      type: 'level_up',
      title: 'Level Up!',
      description: 'Reached level 8',
      xpEarned: 0,
      date: '2024-01-05T16:45:00Z',
    },
  ];
}

function getMockBadges(): Badge[] {
  return [
    {
      id: '1',
      name: 'Eco Warrior',
      description: 'Completed 5 environmental volunteer activities',
      iconUrl: 'https://example.com/eco-warrior.png',
      category: 'Environment',
      rarity: 'rare',
      earnedAt: '2024-01-08T10:15:00Z',
      xpValue: 100,
    },
    {
      id: '2',
      name: 'Community Helper',
      description: 'Completed 10 community service activities',
      iconUrl: 'https://example.com/community-helper.png',
      category: 'Community',
      rarity: 'epic',
      earnedAt: '2024-01-01T12:00:00Z',
      xpValue: 250,
    },
  ];
}

function getMockAchievements(): Achievement[] {
  return [
    {
      id: '1',
      name: 'Volunteer Champion',
      description: 'Complete 50 volunteer activities',
      iconUrl: 'https://example.com/champion.png',
      progress: 15,
      target: 50,
      isCompleted: false,
      xpReward: 500,
    },
    {
      id: '2',
      name: 'Streak Master',
      description: 'Maintain a 30-day volunteer streak',
      iconUrl: 'https://example.com/streak.png',
      progress: 3,
      target: 30,
      isCompleted: false,
      xpReward: 1000,
    },
  ];
}

function getMockUserProfile(): UserProfile {
  return {
    user: getMockUser(),
    stats: getMockUserStats(),
    recentActivity: getMockActivities(),
    badges: getMockBadges(),
    achievements: getMockAchievements(),
  };
}
