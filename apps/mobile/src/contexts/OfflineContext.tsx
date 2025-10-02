import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { offlineService } from '../services/offlineService';

interface OfflineContextType {
  isOnline: boolean;
  isConnected: boolean;
  syncPendingActions: () => Promise<void>;
  addOfflineAction: (action: OfflineAction) => Promise<void>;
  pendingActionsCount: number;
}

interface OfflineAction {
  id: string;
  type: 'APPLY' | 'CHECK_IN' | 'CHECK_OUT' | 'DONATE';
  data: any;
  timestamp: number;
  retryCount: number;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [pendingActionsCount, setPendingActionsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isInternetReachable ?? false);
      setIsConnected(state.isConnected ?? false);
    });

    // Load pending actions count
    loadPendingActionsCount();

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isOnline && isConnected) {
      syncPendingActions();
    }
  }, [isOnline, isConnected]);

  const loadPendingActionsCount = async () => {
    try {
      const count = await offlineService.getPendingActionsCount();
      setPendingActionsCount(count);
    } catch (error) {
      console.error('Error loading pending actions count:', error);
    }
  };

  const syncPendingActions = async () => {
    try {
      await offlineService.syncPendingActions();
      await loadPendingActionsCount();
    } catch (error) {
      console.error('Error syncing pending actions:', error);
    }
  };

  const addOfflineAction = async (action: OfflineAction) => {
    try {
      await offlineService.addOfflineAction(action);
      await loadPendingActionsCount();
    } catch (error) {
      console.error('Error adding offline action:', error);
      throw error;
    }
  };

  const value: OfflineContextType = {
    isOnline,
    isConnected,
    syncPendingActions,
    addOfflineAction,
    pendingActionsCount,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
