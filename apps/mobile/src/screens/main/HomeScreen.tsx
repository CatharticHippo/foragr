import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { useOffline } from '../../contexts/OfflineContext';
import { listingService } from '../../services/listingService';
import { userService } from '../../services/userService';
import ListingCard from '../../components/ListingCard';
import StatsCard from '../../components/StatsCard';
import QuickActions from '../../components/QuickActions';

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { isOnline, pendingActionsCount } = useOffline();

  // Fetch user stats
  const { data: userStats, refetch: refetchStats } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: () => userService.getUserStats(),
    enabled: !!user,
  });

  // Fetch featured listings
  const { data: featuredListings, refetch: refetchListings, isLoading } = useQuery({
    queryKey: ['featuredListings'],
    queryFn: () => listingService.getFeaturedListings(),
  });

  const handleRefresh = () => {
    refetchStats();
    refetchListings();
  };

  const handleListingPress = (listingId: string) => {
    navigation.navigate('ListingDetail', { listingId });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'explore':
        navigation.navigate('Explore');
        break;
      case 'impact':
        navigation.navigate('Impact');
        break;
      case 'scan':
        navigation.navigate('QRScanner');
        break;
      case 'donate':
        // Navigate to donation flow
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.firstName}!</Text>
            <Text style={styles.subtitle}>Ready to make a difference?</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            {user?.profileImageUrl ? (
              <View style={styles.profileImage} />
            ) : (
              <Ionicons name="person-outline" size={24} color="#10B981" />
            )}
          </TouchableOpacity>
        </View>

        {/* Offline Status */}
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color="#EF4444" />
            <Text style={styles.offlineText}>You're offline. Changes will sync when connected.</Text>
          </View>
        )}

        {/* Pending Actions */}
        {pendingActionsCount > 0 && (
          <View style={styles.pendingBanner}>
            <Ionicons name="sync-outline" size={16} color="#F59E0B" />
            <Text style={styles.pendingText}>
              {pendingActionsCount} action{pendingActionsCount > 1 ? 's' : ''} pending sync
            </Text>
          </View>
        )}

        {/* User Stats */}
        {userStats && (
          <View style={styles.statsContainer}>
            <StatsCard
              title="Total XP"
              value={userStats.totalXp.toString()}
              icon="star"
              color="#F59E0B"
            />
            <StatsCard
              title="Hours"
              value={userStats.totalHours.toString()}
              icon="time"
              color="#3B82F6"
            />
            <StatsCard
              title="Badges"
              value={userStats.badgeCount.toString()}
              icon="trophy"
              color="#8B5CF6"
            />
            <StatsCard
              title="Level"
              value={userStats.level.toString()}
              icon="trending-up"
              color="#10B981"
            />
          </View>
        )}

        {/* Quick Actions */}
        <QuickActions onActionPress={handleQuickAction} />

        {/* Featured Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Opportunities</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {featuredListings?.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onPress={() => handleListingPress(listing.id)}
            />
          ))}

          {(!featuredListings || featuredListings.length === 0) && (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No featured listings</Text>
              <Text style={styles.emptyStateText}>
                Check back later for new volunteer opportunities
              </Text>
            </View>
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Volunteer shift completed</Text>
              <Text style={styles.activitySubtitle}>Habitat for Humanity • 2 hours ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1D5DB',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#EF4444',
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FED7AA',
  },
  pendingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#F59E0B',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
});
