import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card } from '../../src/components/Card';
import { ProfileImage } from '../../src/components/ProfileImage';
import { StatusPill } from '../../src/components/StatusPill';
import { XPBar } from '../../src/components/XPBar';

export default function ProfileTab() {
  const { user, logout } = useAuth();

  const achievements = [
    { id: '1', title: 'First Volunteer', description: 'Completed your first volunteer event', icon: '🏆', earned: true },
    { id: '2', title: 'Community Champion', description: 'Volunteered 10+ hours', icon: '⭐', earned: true },
    { id: '3', title: 'Eco Warrior', description: 'Participated in 5 environmental events', icon: '🌱', earned: false },
    { id: '4', title: 'Mentor', description: 'Mentored 3+ youth', icon: '👥', earned: false },
  ];

  const recentActivity = [
    { id: '1', title: 'Beach Cleanup', date: '2 days ago', xp: '+50 XP' },
    { id: '2', title: 'Wildlife Habitat Restoration', date: '1 week ago', xp: '+75 XP' },
    { id: '3', title: 'Youth Mentorship', date: '2 weeks ago', xp: '+100 XP' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <ProfileImage 
            imageUrl={user?.profileImageUrl}
            firstName={user?.firstName}
            lastName={user?.lastName}
            size="xl"
            borderColor="#10B981"
            borderWidth={4}
          />
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <StatusPill 
            status="VOLUNTEER" 
            verified={true} 
            size="lg" 
          />
        </View>

        {/* Progress Section */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressSection}>
            <Text style={styles.levelText}>Level 8</Text>
            <XPBar 
              currentXP={2450}
              nextLevelXP={3000}
              level={8}
            />
            <Text style={styles.xpText}>2,450 / 3,000 XP</Text>
          </View>
        </Card>

        {/* Stats Section */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Organizations</Text>
            </View>
          </View>
        </Card>

        {/* Achievements Section */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <View style={[
                  styles.achievementIcon,
                  { opacity: achievement.earned ? 1 : 0.3 }
                ]}>
                  <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    { opacity: achievement.earned ? 1 : 0.5 }
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    { opacity: achievement.earned ? 1 : 0.5 }
                  ]}>
                    {achievement.description}
                  </Text>
                </View>
                {achievement.earned && (
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                )}
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Activity */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text style={styles.activityXP}>{activity.xp}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Settings */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="person-outline" size={20} color="#6B7280" />
            <Text style={styles.settingText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
            <Text style={styles.settingText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={[styles.settingText, styles.logoutText]}>Sign Out</Text>
          </TouchableOpacity>
        </Card>
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
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  progressSection: {
    marginTop: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  xpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#DC2626',
  },
});
