import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme';
import { EnhancedCard } from '../components/EnhancedCard';
import { Button } from '../components/Button';
import { ProfileImage } from '../components/ProfileImage';
import { StatusPill } from '../components/StatusPill';
import { XPBar } from '../components/XPBar';
import { LoadingState } from '../components/LoadingState';
import { EmptyState } from '../components/EmptyState';

interface ProfileData {
  status: {
    status: 'member' | 'volunteer' | 'donor';
    verified: boolean;
    since?: string;
    xp: number;
    level: number;
    nextLevelAt: number;
    progressPercentage: number;
  };
  titles: Array<{
    id: string;
    orgId: string;
    orgName: string;
    code: string;
    name: string;
    description?: string;
    borderToken: string;
    iconToken: string;
    awardedAt: string;
    xpReward: number;
  }>;
  followedOrgsCount: number;
}

export const EnhancedProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Mock profile data
      const mockProfileData: ProfileData = {
        status: {
          status: 'volunteer',
          verified: true,
          since: '2024-01-15T00:00:00Z',
          xp: 1250,
          level: 2,
          nextLevelAt: 2000,
          progressPercentage: 25,
        },
        titles: [
          {
            id: '1',
            orgId: 'rmef-1',
            orgName: 'Rocky Mountain Elk Foundation',
            code: 'conservation-steward',
            name: 'Conservation Steward',
            description: 'Completed 10+ hours of habitat restoration',
            borderToken: 'border-green',
            iconToken: 'icon-tree',
            awardedAt: '2024-01-20T00:00:00Z',
            xpReward: 100,
          },
          {
            id: '2',
            orgId: 'epi-1',
            orgName: 'Ecology Project International',
            code: 'field-scientist',
            name: 'Field Scientist',
            description: 'Completed 20+ hours of field research',
            borderToken: 'border-blue',
            iconToken: 'icon-microscope',
            awardedAt: '2024-02-01T00:00:00Z',
            xpReward: 120,
          },
          {
            id: '3',
            orgId: 'foy-1',
            orgName: 'Foster Our Youth',
            code: 'mentor-champion',
            name: 'Mentor Champion',
            description: 'Successfully mentored 5+ foster youth',
            borderToken: 'border-purple',
            iconToken: 'icon-heart',
            awardedAt: '2024-02-10T00:00:00Z',
            xpReward: 150,
          },
          {
            id: '4',
            orgId: 'rmef-1',
            orgName: 'Rocky Mountain Elk Foundation',
            code: 'wildlife-photographer',
            name: 'Wildlife Photography Expert',
            description: 'Captured 50+ wildlife photos for conservation',
            borderToken: 'border-green',
            iconToken: 'icon-camera',
            awardedAt: '2024-02-15T00:00:00Z',
            xpReward: 200,
          },
        ],
        followedOrgsCount: 3,
      };

      setProfileData(mockProfileData);
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'volunteer': return theme.colors.status.volunteer.primary;
      case 'donor': return theme.colors.status.donor.primary;
      case 'member': return theme.colors.status.member.primary;
      default: return theme.colors.brand.primary;
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'volunteer': return theme.colors.brand.gradients.primary;
      case 'donor': return theme.colors.brand.gradients.sunset;
      case 'member': return theme.colors.brand.gradients.secondary;
      default: return theme.colors.brand.gradients.primary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
        <LoadingState message="Loading your profile..." />
      </SafeAreaView>
    );
  }

  if (!profileData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
        <EmptyState
          icon="person-outline"
          title="Profile not found"
          description="Unable to load your profile information"
          actionText="Try Again"
          onAction={loadProfileData}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.brand.primary}
            colors={[theme.colors.brand.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header with Gradient Background */}
        <EnhancedCard
          variant="elevated"
          padding={6}
          margin={4}
          style={[
            styles.header,
            { 
              backgroundColor: getStatusBorderColor(profileData.status.status) + '10',
              borderColor: getStatusBorderColor(profileData.status.status) + '30',
              borderWidth: 1,
            }
          ]}
        >
          <View style={styles.profileSection}>
            <ProfileImage
              imageUrl={user?.profileImageUrl}
              firstName={user?.firstName}
              lastName={user?.lastName}
              size="xl"
              borderColor={getStatusBorderColor(profileData.status.status)}
              borderWidth={4}
            />

            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={[styles.userEmail, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                {user?.email}
              </Text>
              
              <View style={styles.statusSection}>
                <StatusPill
                  status={profileData.status.status}
                  verified={profileData.status.verified}
                  size="lg"
                />
                {profileData.status.since && (
                  <Text style={[styles.statusSince, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
                    Since {formatDate(profileData.status.since)}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </EnhancedCard>

        {/* XP Progress with Enhanced Design */}
        <EnhancedCard
          variant="elevated"
          padding={5}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                <Ionicons name="trophy" size={24} color={theme.colors.brand.primary} />
              </View>
              <View>
                <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                  Progress
                </Text>
                <Text style={[styles.sectionSubtitle, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                  Level {profileData.status.level} • {profileData.status.xp.toLocaleString()} XP
                </Text>
              </View>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: theme.colors.brand.primary + '20' }]}>
              <Text style={[styles.levelText, { color: theme.colors.brand.primary }]}>
                Level {profileData.status.level}
              </Text>
            </View>
          </View>
          
          <XPBar
            currentXP={profileData.status.xp}
            nextLevelXP={profileData.status.nextLevelAt}
            level={profileData.status.level}
            size="lg"
          />
          
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={[styles.progressStatValue, { color: theme.colors.semantic.success }]}>
                {profileData.status.xp.toLocaleString()}
              </Text>
              <Text style={[styles.progressStatLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Current XP
              </Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={[styles.progressStatValue, { color: theme.colors.brand.primary }]}>
                {(profileData.status.nextLevelAt - profileData.status.xp).toLocaleString()}
              </Text>
              <Text style={[styles.progressStatLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                To Next Level
              </Text>
            </View>
          </View>
        </EnhancedCard>

        {/* Enhanced Statistics */}
        <EnhancedCard
          variant="elevated"
          padding={5}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.brand.secondary + '20' }]}>
                <Ionicons name="bar-chart" size={24} color={theme.colors.brand.secondary} />
              </View>
              <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                Statistics
              </Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                <Ionicons name="star" size={24} color={theme.colors.semantic.success} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.semantic.success }]}>
                {profileData.status.xp.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Total XP
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.primary + '20' }]}>
                <Ionicons name="trophy" size={24} color={theme.colors.brand.primary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.brand.primary }]}>
                {profileData.titles.length}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Titles Earned
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.secondary + '20' }]}>
                <Ionicons name="people" size={24} color={theme.colors.brand.secondary} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.brand.secondary }]}>
                {profileData.followedOrgsCount}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Organizations
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.brand.accent + '20' }]}>
                <Ionicons name="calendar" size={24} color={theme.colors.brand.accent} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.brand.accent }]}>
                12
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Events Attended
              </Text>
            </View>
          </View>
        </EnhancedCard>

        {/* Enhanced Earned Titles */}
        <EnhancedCard
          variant="elevated"
          padding={5}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.brand.accent + '20' }]}>
                <Ionicons name="ribbon" size={24} color={theme.colors.brand.accent} />
              </View>
              <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                Earned Titles
              </Text>
            </View>
            <View style={[styles.titleCount, { backgroundColor: theme.colors.brand.accent + '20' }]}>
              <Text style={[styles.titleCountText, { color: theme.colors.brand.accent }]}>
                {profileData.titles.length}
              </Text>
            </View>
          </View>
          
          {profileData.titles.length > 0 ? (
            <View style={styles.titlesContainer}>
              {profileData.titles.map((title) => (
                <EnhancedCard
                  key={title.id}
                  variant="outlined"
                  padding={4}
                  margin={2}
                  pressable
                  onPress={() => Alert.alert(title.name, title.description || 'No description available')}
                  style={[
                    styles.titleCard,
                    {
                      backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[50],
                      borderColor: getStatusBorderColor(profileData.status.status) + '40',
                      borderWidth: 1,
                    },
                  ]}
                >
                  <View style={styles.titleContent}>
                    <View style={styles.titleHeader}>
                      <View style={[styles.titleIcon, { backgroundColor: getStatusBorderColor(profileData.status.status) + '20' }]}>
                        <Ionicons name="ribbon" size={20} color={getStatusBorderColor(profileData.status.status)} />
                      </View>
                      <View style={styles.titleInfo}>
                        <Text style={[styles.titleName, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                          {title.name}
                        </Text>
                        <Text style={[styles.titleOrg, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                          {title.orgName}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.titleFooter}>
                      <Text style={[styles.titleDate, { color: isDark ? theme.colors.dark.neutral.gray[500] : theme.colors.neutral.gray[500] }]}>
                        Earned {formatDate(title.awardedAt)}
                      </Text>
                      <View style={styles.titleReward}>
                        <Ionicons name="add-circle" size={16} color={theme.colors.semantic.success} />
                        <Text style={[styles.titleRewardText, { color: theme.colors.semantic.success }]}>
                          +{title.xpReward} XP
                        </Text>
                      </View>
                    </View>
                  </View>
                </EnhancedCard>
              ))}
            </View>
          ) : (
            <EmptyState
              icon="ribbon-outline"
              title="No titles earned yet"
              description="Start volunteering or donating to earn your first title!"
              variant="compact"
            />
          )}
        </EnhancedCard>

        {/* Quick Actions */}
        <EnhancedCard
          variant="elevated"
          padding={5}
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.colors.semantic.info + '20' }]}>
                <Ionicons name="settings" size={24} color={theme.colors.semantic.info} />
              </View>
              <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                Quick Actions
              </Text>
            </View>
          </View>
          
          <View style={styles.quickActions}>
            <Button
              title="Edit Profile"
              variant="outline"
              size="sm"
              icon={<Ionicons name="create-outline" size={16} color={theme.colors.brand.primary} />}
              iconPosition="left"
              onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
            />
            <Button
              title="Settings"
              variant="outline"
              size="sm"
              icon={<Ionicons name="settings-outline" size={16} color={theme.colors.brand.secondary} />}
              iconPosition="left"
              onPress={() => Alert.alert('Settings', 'Settings coming soon!')}
            />
          </View>
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
  profileSection: {
    alignItems: 'center',
    gap: theme.spacing[4],
  },
  userInfo: {
    alignItems: 'center',
    gap: theme.spacing[2],
  },
  userName: {
    ...theme.typography.textStyles.h2,
    textAlign: 'center',
  },
  userEmail: {
    ...theme.typography.textStyles.body,
    textAlign: 'center',
  },
  statusSection: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  statusSince: {
    ...theme.typography.textStyles.caption,
    textAlign: 'center',
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...theme.typography.textStyles.h3,
  },
  sectionSubtitle: {
    ...theme.typography.textStyles.bodySmall,
    marginTop: theme.spacing[1],
  },
  levelBadge: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    ...theme.typography.textStyles.label,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing[4],
    paddingTop: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral.gray[200],
  },
  progressStat: {
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  progressStatValue: {
    ...theme.typography.textStyles.h4,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressStatLabel: {
    ...theme.typography.textStyles.caption,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: theme.spacing[2],
    padding: theme.spacing[3],
    backgroundColor: theme.colors.neutral.gray[50],
    borderRadius: theme.borderRadius.lg,
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
  titleCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCountText: {
    ...theme.typography.textStyles.label,
    fontWeight: theme.typography.fontWeight.bold,
  },
  titlesContainer: {
    gap: theme.spacing[2],
  },
  titleCard: {
    width: '100%',
  },
  titleContent: {
    gap: theme.spacing[3],
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  titleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleInfo: {
    flex: 1,
  },
  titleName: {
    ...theme.typography.textStyles.h4,
    marginBottom: theme.spacing[1],
  },
  titleOrg: {
    ...theme.typography.textStyles.bodySmall,
  },
  titleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleDate: {
    ...theme.typography.textStyles.caption,
  },
  titleReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  titleRewardText: {
    ...theme.typography.textStyles.caption,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  quickActions: {
    gap: theme.spacing[3],
  },
});
