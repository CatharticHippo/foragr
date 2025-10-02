import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/contexts/AuthContext';
import { NotificationProvider } from '../src/contexts/NotificationContext';
import { OfflineProvider } from '../src/contexts/OfflineContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <OfflineProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="loading" options={{ headerShown: false }} />
              <Stack.Screen 
                name="organizations" 
                options={{ 
                  headerShown: false
                }} 
              />
              <Stack.Screen 
                name="create-event" 
                options={{ 
                  headerShown: false
                }} 
              />
            </Stack>
            <StatusBar style="auto" />
          </OfflineProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
