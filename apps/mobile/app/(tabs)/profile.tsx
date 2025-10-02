import { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card } from '../../src/components/Card';
import { ProfileImage } from '../../src/components/ProfileImage';
import { StatusPill } from '../../src/components/StatusPill';
import { XPBar } from '../../src/components/XPBar';

export default function ProfileTab() {
  const { user, logout } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const achievements = [
    { id: '1', title: 'First Volunteer', description: 'Completed your first volunteer event', icon: 'trophy', earned: true },
    { id: '2', title: 'Community Champion', description: 'Volunteered 10+ hours', icon: 'star', earned: true },
    { id: '3', title: 'Eco Warrior', description: 'Participated in 5 environmental events', icon: 'leaf', earned: false },
    { id: '4', title: 'Mentor', description: 'Mentored 3+ youth', icon: 'people', earned: false },
  ];

  const recentActivity = [
    { id: '1', title: 'Beach Cleanup', date: '2 days ago', xp: '+50 XP' },
    { id: '2', title: 'Wildlife Habitat Restoration', date: '1 week ago', xp: '+75 XP' },
    { id: '3', title: 'Youth Mentorship', date: '2 weeks ago', xp: '+100 XP' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Hamburger Menu */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsMenuVisible(true)}
        >
          <Ionicons name="menu" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <ProfileImage 
            {...(user?.profileImageUrl && { imageUrl: user.profileImageUrl })}
            {...(user?.firstName && { firstName: user.firstName })}
            {...(user?.lastName && { lastName: user.lastName })}
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
                  <Ionicons 
                    name={achievement.icon as any} 
                    size={24} 
                    color={achievement.earned ? '#10B981' : '#6B7280'} 
                  />
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

      </ScrollView>

      {/* Settings Menu Modal */}
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Settings</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setIsMenuVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="notifications-outline" size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Notifications</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="shield-outline" size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>Privacy & Security</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
                <Text style={styles.menuItemText}>About</Text>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <View style={styles.menuDivider} />
              
              <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logout}>
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
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
  // Modal and Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area for home indicator
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItems: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  logoutItem: {
    // No special styling needed, logout styling is handled by logoutText
  },
  logoutText: {
    color: '#DC2626',
  },
});
