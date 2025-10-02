import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { StatusPill, XPBar, OrgChip, Card, LoadingState, EmptyState, ProfileImage } from '../components';
import { theme } from '../theme';

interface ProfileData {
  status: {
    status: 'MEMBER' | 'VOLUNTEER' | 'DONOR';
    colorToken: string;
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
    borderToken?: string;
    iconToken?: string;
    awardedAt: string;
    xpReward: number;
  }>;
  followedOrgsCount: number;
}

export const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfileData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await apiClient.get('/profile/status');
      // setProfileData(response.data);
      
      // Mock data for demo
      setProfileData({
        status: {
          status: 'VOLUNTEER',
          colorToken: '#10B981',
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
      });
    } catch (error) {
      console.error('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfileData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case 'VOLUNTEER':
        return theme.colors.semantic.success;
      case 'DONOR':
        return theme.colors.semantic.warning;
      case 'MEMBER':
        return theme.colors.semantic.info;
      default:
        return theme.colors.neutral.gray[400];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
        <LoadingState 
          message="Loading your profile..." 
          size="large" 
          variant="centered" 
        />
      </SafeAreaView>
    );
  }

  if (!profileData || !user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]}>
        <Text style={[styles.errorText, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600] }]}>
          Unable to load profile data
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={theme.colors.semantic.info}
            colors={[theme.colors.semantic.info]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Image */}
        <Card 
          variant="elevated" 
          padding={6} 
          margin={4}
          style={[styles.header, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.profileSection}>
            <ProfileImage
              imageUrl={user.profileImageUrl}
              firstName={user.firstName}
              lastName={user.lastName}
              size="xl"
              borderColor={getStatusBorderColor(profileData.status.status)}
              borderWidth={4}
            />
            
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={[styles.userEmail, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                {user.email}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
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
        </Card>

        {/* XP Progress */}
        <Card 
          variant="elevated" 
          padding={4} 
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
              Progress
            </Text>
            <View style={styles.levelBadge}>
              <Text style={[styles.levelText, { color: theme.colors.semantic.info }]}>
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
        </Card>

        {/* Statistics */}
        <Card 
          variant="elevated" 
          padding={4} 
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
            Statistics
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.semantic.info + '20' }]}>
                <Ionicons name="star" size={24} color={theme.colors.semantic.info} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.semantic.info }]}>
                {profileData.status.xp.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Total XP
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.semantic.success + '20' }]}>
                <Ionicons name="trophy" size={24} color={theme.colors.semantic.success} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.semantic.success }]}>
                {profileData.titles.length}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Titles Earned
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.semantic.warning + '20' }]}>
                <Ionicons name="people" size={24} color={theme.colors.semantic.warning} />
              </View>
              <Text style={[styles.statValue, { color: theme.colors.semantic.warning }]}>
                {profileData.followedOrgsCount}
              </Text>
              <Text style={[styles.statLabel, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                Organizations
              </Text>
            </View>
          </View>
        </Card>

        {/* Earned Titles */}
        <Card 
          variant="elevated" 
          padding={4} 
          margin={4}
          style={[styles.section, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
        >
          <Text style={[styles.sectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
            Earned Titles
          </Text>
          {profileData.titles.length > 0 ? (
            <View style={styles.titlesContainer}>
              {profileData.titles.map((title) => (
                <Card
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
                      borderColor: getStatusBorderColor(profileData.status.status),
                    },
                  ]}
                >
                  <View style={styles.titleHeader}>
                    <View style={[styles.titleIcon, { backgroundColor: getStatusBorderColor(profileData.status.status) + '20' }]}>
                      <Ionicons name="ribbon" size={20} color={getStatusBorderColor(profileData.status.status)} />
                    </View>
                    <View style={styles.titleInfo}>
                      <Text 
                        style={[styles.titleName, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}
                        numberOfLines={2}
                      >
                        {title.name}
                      </Text>
                      <Text 
                        style={[styles.titleOrg, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}
                        numberOfLines={1}
                      >
                        {title.orgName}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.titleDate, { color: isDark ? theme.colors.dark.neutral.gray[500] : theme.colors.neutral.gray[500] }]}>
                    Earned {formatDate(title.awardedAt)}
                  </Text>
                  <View style={styles.titleReward}>
                    <Ionicons name="add-circle" size={16} color={theme.colors.semantic.success} />
                    <Text style={[styles.titleRewardText, { color: theme.colors.semantic.success }]}>
                      +{title.xpReward} XP
                    </Text>
                  </View>
                </Card>
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
        </Card>
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
    // Header styles handled by Card component
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  userInfo: {
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  userName: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
    textAlign: 'center',
  },
  userEmail: {
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
  },
  statusSection: {
    alignItems: 'center',
  },
  statusSince: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing[2],
    textAlign: 'center',
  },
  section: {
    // Section styles handled by Card component
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  levelBadge: {
    backgroundColor: theme.colors.semantic.info + '20',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
  },
  levelText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing[2],
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.medium,
  },
  titlesContainer: {
    // Single column layout to prevent clipping
  },
  titleCard: {
    width: '100%',
    marginBottom: theme.spacing[3],
    minHeight: 120, // Ensure minimum height for readability
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  titleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[2],
  },
  titleInfo: {
    flex: 1,
  },
  titleName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing[1],
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.base,
  },
  titleOrg: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.sm,
  },
  titleDate: {
    fontSize: theme.typography.fontSize.xs,
    marginBottom: theme.spacing[2],
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xs,
  },
  titleReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  titleRewardText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
    marginTop: theme.spacing[8],
  },
});
