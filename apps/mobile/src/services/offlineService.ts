import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export interface OfflineAction {
  id: string;
  type: 'rsvp' | 'checkin' | 'checkout' | 'donation' | 'profile_update';
  payload: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

export interface OfflineData {
  actions: OfflineAction[];
  lastSync: number;
  version: string;
}

const OFFLINE_STORAGE_KEY = 'offline_data';
const OFFLINE_VERSION = '1.0.0';

export const offlineService = {
  // Initialize offline service
  async initialize(): Promise<void> {
    try {
      const data = await this.getOfflineData();
      if (!data) {
        await this.saveOfflineData({
          actions: [],
          lastSync: Date.now(),
          version: OFFLINE_VERSION,
        });
      }
    } catch (error) {
      console.error('Error initializing offline service:', error);
    }
  },

  // Get offline data from storage
  async getOfflineData(): Promise<OfflineData | null> {
    try {
      const data = await AsyncStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  },

  // Save offline data to storage
  async saveOfflineData(data: OfflineData): Promise<void> {
    try {
      await AsyncStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  },

  // Add an action to the offline queue
  async addOfflineAction(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    try {
      const data = await this.getOfflineData();
      if (!data) {
        await this.initialize();
        return this.addOfflineAction(action);
      }

      const newAction: OfflineAction = {
        ...action,
        id: this.generateActionId(),
        timestamp: Date.now(),
        retryCount: 0,
      };

      data.actions.push(newAction);
      await this.saveOfflineData(data);

      return newAction.id;
    } catch (error) {
      console.error('Error adding offline action:', error);
      throw error;
    }
  },

  // Get pending actions
  async getPendingActions(): Promise<OfflineAction[]> {
    try {
      const data = await this.getOfflineData();
      return data?.actions || [];
    } catch (error) {
      console.error('Error getting pending actions:', error);
      return [];
    }
  },

  // Get pending actions count
  async getPendingActionsCount(): Promise<number> {
    try {
      const actions = await this.getPendingActions();
      return actions.length;
    } catch (error) {
      console.error('Error getting pending actions count:', error);
      return 0;
    }
  },

  // Remove completed action
  async removeAction(actionId: string): Promise<void> {
    try {
      const data = await this.getOfflineData();
      if (!data) return;

      data.actions = data.actions.filter(action => action.id !== actionId);
      await this.saveOfflineData(data);
    } catch (error) {
      console.error('Error removing action:', error);
    }
  },

  // Update action retry count
  async updateActionRetryCount(actionId: string, retryCount: number): Promise<void> {
    try {
      const data = await this.getOfflineData();
      if (!data) return;

      const action = data.actions.find(a => a.id === actionId);
      if (action) {
        action.retryCount = retryCount;
        await this.saveOfflineData(data);
      }
    } catch (error) {
      console.error('Error updating action retry count:', error);
    }
  },

  // Clear all offline actions
  async clearAllActions(): Promise<void> {
    try {
      const data = await this.getOfflineData();
      if (!data) return;

      data.actions = [];
      data.lastSync = Date.now();
      await this.saveOfflineData(data);
    } catch (error) {
      console.error('Error clearing all actions:', error);
    }
  },

  // Check network connectivity
  async isOnline(): Promise<boolean> {
    try {
      const netInfo = await NetInfo.fetch();
      return netInfo.isConnected === true && netInfo.isInternetReachable === true;
    } catch (error) {
      console.error('Error checking network status:', error);
      return false;
    }
  },

  // Sync pending actions when online
  async syncPendingActions(): Promise<{ success: number; failed: number }> {
    try {
      const isOnline = await this.isOnline();
      if (!isOnline) {
        return { success: 0, failed: 0 };
      }

      const actions = await this.getPendingActions();
      let successCount = 0;
      let failedCount = 0;

      for (const action of actions) {
        try {
          await this.executeAction(action);
          await this.removeAction(action.id);
          successCount++;
        } catch (error) {
          console.error(`Error executing action ${action.id}:`, error);
          
          // Increment retry count
          const newRetryCount = action.retryCount + 1;
          await this.updateActionRetryCount(action.id, newRetryCount);

          // Remove action if max retries exceeded
          if (newRetryCount >= action.maxRetries) {
            await this.removeAction(action.id);
            failedCount++;
          }
        }
      }

      // Update last sync time
      const data = await this.getOfflineData();
      if (data) {
        data.lastSync = Date.now();
        await this.saveOfflineData(data);
      }

      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error('Error syncing pending actions:', error);
      return { success: 0, failed: 0 };
    }
  },

  // Execute a specific action
  async executeAction(action: OfflineAction): Promise<void> {
    // This would typically make API calls based on the action type
    // For now, we'll simulate the execution
    switch (action.type) {
      case 'rsvp':
        // Simulate RSVP API call
        await this.simulateApiCall('POST', `/listings/${action.payload.listingId}/rsvp`);
        break;
      case 'checkin':
        // Simulate check-in API call
        await this.simulateApiCall('POST', '/attendance/check-in', action.payload);
        break;
      case 'checkout':
        // Simulate check-out API call
        await this.simulateApiCall('POST', '/attendance/check-out', action.payload);
        break;
      case 'donation':
        // Simulate donation API call
        await this.simulateApiCall('POST', '/donations', action.payload);
        break;
      case 'profile_update':
        // Simulate profile update API call
        await this.simulateApiCall('PUT', '/users/me', action.payload);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  },

  // Simulate API call (replace with actual API calls)
  async simulateApiCall(method: string, url: string, data?: any): Promise<any> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random failures for testing
    if (Math.random() < 0.1) { // 10% failure rate
      throw new Error('Simulated API failure');
    }

    return { success: true, data };
  },

  // Generate unique action ID
  generateActionId(): string {
    return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get offline data size (for debugging)
  async getOfflineDataSize(): Promise<number> {
    try {
      const data = await this.getOfflineData();
      return data ? JSON.stringify(data).length : 0;
    } catch (error) {
      console.error('Error getting offline data size:', error);
      return 0;
    }
  },

  // Clean up old actions (older than 7 days)
  async cleanupOldActions(): Promise<void> {
    try {
      const data = await this.getOfflineData();
      if (!data) return;

      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      data.actions = data.actions.filter(action => action.timestamp > sevenDaysAgo);
      
      await this.saveOfflineData(data);
    } catch (error) {
      console.error('Error cleaning up old actions:', error);
    }
  },
};
