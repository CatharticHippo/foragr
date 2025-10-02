import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import { listingService } from '../services/listingService';
import { userService } from '../services/userService';
import { router } from 'expo-router';
import { theme } from '../theme';
import { EnhancedCard } from '../components/EnhancedCard';
import { Button } from '../components/Button';
import { ProfileImage } from '../components/ProfileImage';
import { StatusPill } from '../components/StatusPill';
import { XPBar } from '../components/XPBar';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

export const EnhancedHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { isOnline, pendingActionsCount } = useOffline();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
    router.push(`/listing/${listingId}`);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'explore':
        router.push('/(tabs)/explore');
        break;
      case 'impact':
        router.push('/impact');
        break;
      case 'scan':
        router.push('/qr-scanner');
        break;
      case 'donate':
        router.push('/donate');
        break;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'volunteer': return theme.colors.status.volunteer.primary;
      case 'donor': return theme.colors.status.donor.primary;
      case 'member': return theme.colors.status.member.primary;
      default: return theme.colors.brand.primary;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]}>
        <LoadingState message="Loading your dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header */}
        <EnhancedCard
          variant="elevated"
          padding={6}
          margin={4}
          style={[styles.header, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={[styles.greeting, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                {getGreeting()},
              </Text>
              <Text style={[styles.userName, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
                {user?.firstName}!
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Ready to make a difference today?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => router.push('/(tabs)/profile')}
            >
              <ProfileImage
                imageUrl={user?.profileImageUrl}
                firstName={user?.firstName}
                lastName={user?.lastName}
                size="md"
                borderColor={getStatusColor(userStats?.status || 'member')}
                borderWidth={3}
              />
            </TouchableOpacity>
          </View>
        </EnhancedCard>

        {/* Status Banner */}
        {userStats && (
          <EnhancedCard
            variant="filled"
            padding={4}
            margin={4}
            style={[styles.statusCard, { backgroundColor: getStatusColor(userStats.status) + '10' }]}
          >
            <View style={styles.statusContent}>
              <View style={styles.statusInfo}>
                <StatusPill
                  status={userStats.status as any}
                  verified={true}
                  size="md"
                />
                <Text style={[styles.statusText, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[700] }]}>
                  Level {userStats.level} • {userStats.totalXp.toLocaleString()} XP
                </Text>
              </View>
              <XPBar
                currentXP={userStats.totalXp}
                nextLevelXP={userStats.nextLevelAt}
                level={userStats.level}
                size="sm"
              />
            </View>
          </EnhancedCard>
        )}

        {/* Offline/Pending Status */}
        {(!isOnline || pendingActionsCount > 0) && (
          <EnhancedCard
            variant="outlined"
            padding={3}
            margin={4}
            style={[
              styles.statusBanner,
              { 
                backgroundColor: !isOnline 
                  ? theme.colors.semantic.errorLight 
                  : theme.colors.semantic.warningLight,
                borderColor: !isOnline 
                  ? theme.colors.semantic.error 
                  : theme.colors.semantic.warning,
              }
            ]}
          >
            <View style={styles.bannerContent}>
              <Ionicons 
                name={!isOnline ? "cloud-offline-outline" : "sync-outline"} 
                size={20} 
                color={!isOnline ? theme.colors.semantic.error : theme.colors.semantic.warning} 
              />
              <Text style={[
                styles.bannerText,
                { color: !isOnline ? theme.colors.semantic.error : theme.colors.semantic.warning }
              ]}>
                {!isOnline 
                  ? "You're offline. Changes will sync when connected."
                  : `${pendingActionsCount} action${pendingActionsCount > 1 ? 's' : ''} pending sync`
                }
              </Text>
            </View>
          </EnhancedCard>
        )}

        {/* Quick Actions */}
        <EnhancedCard
          variant="elevated"
          padding={4}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
              onPress={() => handleQuickAction('explore')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                <Ionicons name="search" size={24} color={theme.colors.brand.primary} />
              </View>
              <Text style={[styles.actionText, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
                Explore
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
              onPress={() => handleQuickAction('scan')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.brand.secondary + '20' }]}>
                <Ionicons name="qr-code" size={24} color={theme.colors.brand.secondary} />
              </View>
              <Text style={[styles.actionText, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
                Scan QR
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
              onPress={() => handleQuickAction('donate')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.brand.accent + '20' }]}>
                <Ionicons name="heart" size={24} color={theme.colors.brand.accent} />
              </View>
              <Text style={[styles.actionText, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
                Donate
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
              onPress={() => handleQuickAction('impact')}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                <Ionicons name="bar-chart" size={24} color={theme.colors.semantic.success} />
              </View>
              <Text style={[styles.actionText, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
                Impact
              </Text>
            </TouchableOpacity>
          </View>
        </EnhancedCard>

        {/* Stats Overview */}
        {userStats && (
          <EnhancedCard
            variant="elevated"
            padding={4}
            margin={4}
            style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
          >
            <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
              Your Impact
            </Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                  <Ionicons name="star" size={24} color={theme.colors.semantic.success} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.semantic.success }]}>
                  {userStats.totalXp.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Total XP
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                  <Ionicons name="time" size={24} color={theme.colors.brand.primary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.brand.primary }]}>
                  {userStats.totalHours}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Hours
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.secondary + '20' }]}>
                  <Ionicons name="trophy" size={24} color={theme.colors.brand.secondary} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.brand.secondary }]}>
                  {userStats.badgeCount}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Badges
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.accent + '20' }]}>
                  <Ionicons name="trending-up" size={24} color={theme.colors.brand.accent} />
                </View>
                <Text style={[styles.statValue, { color: theme.colors.brand.accent }]}>
                  {userStats.level}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Level
                </Text>
              </View>
            </View>
          </EnhancedCard>
        )}

        {/* Featured Opportunities */}
        <EnhancedCard
          variant="elevated"
          padding={4}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
              Featured Opportunities
            </Text>
            <Button
              title="See All"
              variant="ghost"
              size="sm"
              onPress={() => router.push('/(tabs)/explore')}
            />
          </View>

          {featuredListings && featuredListings.length > 0 ? (
            <View style={styles.listingsContainer}>
              {featuredListings.slice(0, 3).map((listing) => (
                <EnhancedCard
                  key={listing.id}
                  variant="outlined"
                  padding={4}
                  margin={2}
                  pressable
                  onPress={() => handleListingPress(listing.id)}
                  style={[styles.listingCard, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
                >
                  <View style={styles.listingContent}>
                    <View style={styles.listingHeader}>
                      <Text style={[styles.listingTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                        {listing.title}
                      </Text>
                      <Ionicons name="chevron-forward" size={16} color={isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500]} />
                    </View>
                    <Text style={[styles.listingDescription, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600] }]}>
                      {listing.description}
                    </Text>
                    <View style={styles.listingMeta}>
                      <View style={styles.listingMetaItem}>
                        <Ionicons name="location-outline" size={14} color={theme.colors.brand.primary} />
                        <Text style={[styles.listingMetaText, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
                          {listing.location}
                        </Text>
                      </View>
                      <View style={styles.listingMetaItem}>
                        <Ionicons name="time-outline" size={14} color={theme.colors.brand.secondary} />
                        <Text style={[styles.listingMetaText, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
                          {listing.duration}
                        </Text>
                      </View>
                    </View>
                  </View>
                </EnhancedCard>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="heart-outline"
              title="No featured opportunities"
              description="Check back later for new volunteer opportunities"
              variant="compact"
            />
          )}
        </EnhancedCard>

        {/* Recent Activity */}
        <EnhancedCard
          variant="elevated"
          padding={4}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
            Recent Activity
          </Text>
          <EnhancedCard
            variant="filled"
            padding={3}
            margin={2}
            style={[styles.activityCard, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50] }]}
          >
            <View style={styles.activityContent}>
              <View style={[styles.activityIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.semantic.success} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={[styles.activityTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                  Volunteer shift completed
                </Text>
                <Text style={[styles.activitySubtitle, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Habitat for Humanity • 2 hours ago
                </Text>
              </View>
            </View>
          </EnhancedCard>
        </EnhancedCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing[2],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    ...theme.typography.textStyles.h3,
    marginBottom: theme.spacing[1],
  },
  userName: {
    ...theme.typography.textStyles.h2,
    marginBottom: theme.spacing[1],
  },
  subtitle: {
    ...theme.typography.textStyles.body,
  },
  profileButton: {
    marginLeft: theme.spacing[4],
  },
  statusCard: {
    marginBottom: theme.spacing[2],
  },
  statusContent: {
    gap: theme.spacing[3],
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    ...theme.typography.textStyles.caption,
  },
  statusBanner: {
    marginBottom: theme.spacing[2],
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  bannerText: {
    ...theme.typography.textStyles.bodySmall,
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
  },
  quickActions: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  actionButton: {
    flex: 1,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    ...theme.typography.textStyles.label,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing[3],
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    ...theme.typography.textStyles.h4,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statLabel: {
    ...theme.typography.textStyles.caption,
    textAlign: 'center',
  },
  listingsContainer: {
    gap: theme.spacing[2],
  },
  listingCard: {
    marginBottom: theme.spacing[2],
  },
  listingContent: {
    gap: theme.spacing[2],
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingTitle: {
    ...theme.typography.textStyles.h4,
    flex: 1,
  },
  listingDescription: {
    ...theme.typography.textStyles.bodySmall,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
  },
  listingMeta: {
    flexDirection: 'row',
    gap: theme.spacing[4],
  },
  listingMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  listingMetaText: {
    ...theme.typography.textStyles.caption,
  },
  activityCard: {
    marginTop: theme.spacing[2],
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    ...theme.typography.textStyles.body,
    fontWeight: theme.typography.fontWeight.medium,
  },
  activitySubtitle: {
    ...theme.typography.textStyles.caption,
    marginTop: theme.spacing[1],
  },
});
