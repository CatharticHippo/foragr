import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { apiClient } from '../config/api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  type: 'listing_reminder' | 'rsvp_confirmation' | 'badge_earned' | 'level_up' | 'donation_receipt' | 'general';
  timestamp: number;
  isRead: boolean;
  actionUrl?: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  badge?: number;
}

export const notificationService = {
  // Initialize notification service
  async initialize(): Promise<string | null> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return null;
      }

      // Get push token
      const token = await this.getExpoPushToken();
      
      // Register token with backend
      if (token) {
        await this.registerPushToken(token);
      }

      return token;
    } catch (error) {
      console.error('Error initializing notification service:', error);
      return null;
    }
  },

  // Get Expo push token
  async getExpoPushToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'b3cd8cc9-21b3-47c4-a62a-70e5207e97ea', // Your EAS project ID
      });

      return token.data;
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  },

  // Register push token with backend
  async registerPushToken(token: string): Promise<void> {
    try {
      await apiClient.post('/notifications/register-token', {
        token,
        platform: Platform.OS,
        deviceId: await this.getDeviceId(),
      });
    } catch (error) {
      console.error('Error registering push token:', error);
      // Don't throw error as this shouldn't block the app
    }
  },

  // Alias for registerPushToken (for compatibility)
  async registerToken(token: string): Promise<void> {
    return this.registerPushToken(token);
  },

  // Get device ID (simplified version)
  async getDeviceId(): Promise<string> {
    // In a real app, you'd use a proper device ID library
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Schedule local notification
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null,
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      throw error;
    }
  },

  // Schedule listing reminder
  async scheduleListingReminder(
    listingId: string,
    listingTitle: string,
    reminderTime: Date
  ): Promise<string> {
    try {
      return await this.scheduleLocalNotification(
        'Volunteer Reminder',
        `Don't forget about "${listingTitle}" starting soon!`,
        {
          type: 'listing_reminder',
          listingId,
        },
        { date: reminderTime }
      );
    } catch (error) {
      console.error('Error scheduling listing reminder:', error);
      throw error;
    }
  },

  // Cancel notification
  async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  // Get notification history
  async getNotificationHistory(): Promise<NotificationData[]> {
    try {
      const response = await apiClient.get('/notifications/history');
      return response.data;
    } catch (error) {
      console.error('Error getting notification history:', error);
      // Return mock data for development
      return this.getMockNotifications();
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Send push notification (admin function)
  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload
  ): Promise<void> {
    try {
      await apiClient.post('/notifications/send', {
        userId,
        ...payload,
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  },

  // Update notification preferences
  async updatePreferences(preferences: {
    listingReminders: boolean;
    rsvpConfirmations: boolean;
    badgeNotifications: boolean;
    levelUpNotifications: boolean;
    donationReceipts: boolean;
    generalNotifications: boolean;
  }): Promise<void> {
    try {
      await apiClient.put('/notifications/preferences', preferences);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  // Get notification preferences
  async getPreferences(): Promise<{
    listingReminders: boolean;
    rsvpConfirmations: boolean;
    badgeNotifications: boolean;
    levelUpNotifications: boolean;
    donationReceipts: boolean;
    generalNotifications: boolean;
  }> {
    try {
      const response = await apiClient.get('/notifications/preferences');
      return response.data;
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      // Return default preferences
      return {
        listingReminders: true,
        rsvpConfirmations: true,
        badgeNotifications: true,
        levelUpNotifications: true,
        donationReceipts: true,
        generalNotifications: true,
      };
    }
  },

  // Handle notification received
  onNotificationReceived(callback: (notification: Notifications.Notification) => void): void {
    Notifications.addNotificationReceivedListener(callback);
  },

  // Handle notification response (when user taps notification)
  onNotificationResponse(callback: (response: Notifications.NotificationResponse) => void): void {
    Notifications.addNotificationResponseReceivedListener(callback);
  },

  // Remove notification listeners
  removeNotificationListeners(): void {
    Notifications.removeAllNotificationListeners();
  },

  // Get badge count
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('Error getting badge count:', error);
      return 0;
    }
  },

  // Set badge count
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  },

  // Clear badge count
  async clearBadgeCount(): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge count:', error);
    }
  },
};

// Mock data for development
function getMockNotifications(): NotificationData[] {
  return [
    {
      id: '1',
      title: 'Volunteer Reminder',
      body: 'Don\'t forget about "Beach Cleanup at Santa Monica" starting in 1 hour!',
      type: 'listing_reminder',
      timestamp: Date.now() - 3600000, // 1 hour ago
      isRead: false,
      actionUrl: '/listing/1',
      data: { listingId: '1' },
    },
    {
      id: '2',
      title: 'RSVP Confirmed',
      body: 'You\'re confirmed for "Tutoring at Local Elementary School" on Jan 20th',
      type: 'rsvp_confirmation',
      timestamp: Date.now() - 7200000, // 2 hours ago
      isRead: true,
      actionUrl: '/listing/2',
      data: { listingId: '2' },
    },
    {
      id: '3',
      title: 'Badge Earned!',
      body: 'Congratulations! You\'ve earned the "Eco Warrior" badge',
      type: 'badge_earned',
      timestamp: Date.now() - 86400000, // 1 day ago
      isRead: false,
      actionUrl: '/profile/badges',
      data: { badgeId: 'badge1' },
    },
    {
      id: '4',
      title: 'Level Up!',
      body: 'You\'ve reached level 8! Keep up the great work!',
      type: 'level_up',
      timestamp: Date.now() - 172800000, // 2 days ago
      isRead: true,
      actionUrl: '/profile',
      data: { level: 8 },
    },
  ];
}
