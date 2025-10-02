import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Card } from '../../src/components/Card';
import { StatusPill } from '../../src/components/StatusPill';
import { XPBar } from '../../src/components/XPBar';
import { ProfileImage } from '../../src/components/ProfileImage';

export default function HomeScreen() {
  const { user } = useAuth();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back!</Text>
          {user && (
            <Text style={styles.userInfo}>
              {user.firstName} {user.lastName}
            </Text>
          )}
          <StatusPill 
            status="VOLUNTEER" 
            verified={true} 
            size="md" 
          />
        </View>
        
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.cardTitle}>Today's Opportunities</Text>
          <View style={styles.opportunitiesList}>
            <View style={styles.opportunityItem}>
              <View style={styles.opportunityIcon}>
                <Text style={styles.opportunityEmoji}>🌊</Text>
              </View>
              <View style={styles.opportunityContent}>
                <Text style={styles.opportunityTitle}>Beach Cleanup</Text>
                <Text style={styles.opportunityTime}>9:00 AM - 12:00 PM</Text>
                <Text style={styles.opportunityLocation}>Santa Monica Beach</Text>
              </View>
              <View style={styles.opportunityXP}>
                <Text style={styles.xpText}>+50 XP</Text>
              </View>
            </View>
            <View style={styles.opportunityItem}>
              <View style={styles.opportunityIcon}>
                <Text style={styles.opportunityEmoji}>🌱</Text>
              </View>
              <View style={styles.opportunityContent}>
                <Text style={styles.opportunityTitle}>Tree Planting</Text>
                <Text style={styles.opportunityTime}>2:00 PM - 5:00 PM</Text>
                <Text style={styles.opportunityLocation}>Griffith Park</Text>
              </View>
              <View style={styles.opportunityXP}>
                <Text style={styles.xpText}>+75 XP</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.cardTitle}>Quick Stats</Text>
          <View style={styles.statsRow}>
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
          </View>
        </Card>
        
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButtonLarge} onPress={() => router.push('/organizations')}>
              <View style={styles.actionIconLarge}>
                <Text style={styles.actionEmojiLarge}>🏢</Text>
              </View>
              <Text style={styles.actionTextLarge}>Organizations</Text>
              <Text style={styles.actionSubtext}>Browse verified nonprofits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonLarge} onPress={() => router.push('/create-event')}>
              <View style={styles.actionIconLarge}>
                <Text style={styles.actionEmojiLarge}>🤝</Text>
              </View>
              <Text style={styles.actionTextLarge}>Create Event</Text>
              <Text style={styles.actionSubtext}>Start a Friendship Forage</Text>
            </TouchableOpacity>
          </View>
        </Card>
        
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.cardTitle}>Community Updates</Text>
          <View style={styles.updateItem}>
            <View style={styles.updateIcon}>
              <Text style={styles.updateEmoji}>🎉</Text>
            </View>
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>Welcome to the community!</Text>
              <Text style={styles.updateDescription}>You've joined 1,247 volunteers making a difference in Los Angeles.</Text>
            </View>
          </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  userInfo: {
    fontSize: 14,
    color: '#10B981',
    textAlign: 'center',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
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
  opportunitiesList: {
    gap: 12,
  },
  opportunityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  opportunityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  opportunityEmoji: {
    fontSize: 20,
  },
  opportunityContent: {
    flex: 1,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  opportunityTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  opportunityLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  opportunityXP: {
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  actionButtonLarge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  actionIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionEmojiLarge: {
    fontSize: 32,
  },
  actionTextLarge: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateEmoji: {
    fontSize: 20,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});