import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Card } from '../src/components/Card';
import { theme } from '../src/theme';

export default function OrganizationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const organizations = [
    {
      id: '1',
      name: 'Rocky Mountain Elk Foundation',
      description: 'Conserving wildlife habitat and promoting hunting heritage',
      category: 'Wildlife Conservation',
      verified: true,
      logo: 'leaf',
      color: '#059669',
      members: 1250,
      events: 45,
      location: 'Missoula, MT',
    },
    {
      id: '2',
      name: 'Ecology Project International',
      description: 'Connecting students with nature through hands-on conservation',
      category: 'Environmental Education',
      verified: true,
      logo: 'leaf',
      color: '#2563EB',
      members: 890,
      events: 32,
      location: 'Missoula, MT',
    },
    {
      id: '3',
      name: 'Foster Our Youth',
      description: 'Supporting foster youth through mentorship and community',
      category: 'Youth Development',
      verified: true,
      logo: 'people',
      color: '#D97706',
      members: 2100,
      events: 78,
      location: 'Los Angeles, CA',
    },
    {
      id: '4',
      name: 'Habitat for Humanity',
      description: 'Building homes, communities, and hope',
      category: 'Housing',
      verified: true,
      logo: 'home',
      color: '#DC2626',
      members: 15000,
      events: 200,
      location: 'Atlanta, GA',
    },
    {
      id: '5',
      name: 'Feeding America',
      description: 'Fighting hunger and feeding hope across America',
      category: 'Food Security',
      verified: true,
      logo: 'restaurant',
      color: '#7C3AED',
      members: 8500,
      events: 150,
      location: 'Chicago, IL',
    },
    {
      id: '6',
      name: 'American Red Cross',
      description: 'Preventing and alleviating human suffering in emergencies',
      category: 'Disaster Relief',
      verified: true,
      logo: 'medical',
      color: '#DC2626',
      members: 25000,
      events: 300,
      location: 'Washington, DC',
    },
  ];

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Organizations</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search organizations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Organizations List */}
        <View style={styles.organizationsList}>
          {filteredOrgs.map((org) => (
            <Card key={org.id} variant="elevated" padding={4} margin={2}>
              <TouchableOpacity style={styles.orgItem}>
                <View style={styles.orgHeader}>
                  <View style={[styles.orgLogo, { backgroundColor: org.color }]}>
                    <Ionicons name={org.logo as any} size={28} color="#FFFFFF" />
                  </View>
                  <View style={styles.orgInfo}>
                    <View style={styles.orgTitleRow}>
                      <Text style={styles.orgName}>{org.name}</Text>
                      {org.verified && (
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      )}
                    </View>
                    <Text style={styles.orgCategory}>{org.category}</Text>
                    <Text style={styles.orgLocation}>
                      <Ionicons name="location-outline" size={14} color="#6B7280" />
                      {' '}{org.location}
                    </Text>
                  </View>
                </View>
                <Text style={styles.orgDescription}>{org.description}</Text>
                <View style={styles.orgStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{org.members.toLocaleString()}</Text>
                    <Text style={styles.statLabel}>Members</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{org.events}</Text>
                    <Text style={styles.statLabel}>Events</Text>
                  </View>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* Add Organization CTA */}
        <Card variant="elevated" padding={4} margin={4}>
          <View style={styles.addOrgContainer}>
            <View style={styles.addOrgIcon}>
              <Ionicons name="add-circle-outline" size={32} color="#10B981" />
            </View>
            <View style={styles.addOrgContent}>
              <Text style={styles.addOrgTitle}>Represent an Organization?</Text>
              <Text style={styles.addOrgDescription}>
                Join our platform and start connecting with volunteers in your community.
              </Text>
              <TouchableOpacity style={styles.addOrgButton}>
                <Text style={styles.addOrgButtonText}>Add Your Organization</Text>
              </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...theme.elevation.sm,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  organizationsList: {
    gap: 12,
  },
  orgItem: {
    flex: 1,
  },
  orgHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orgLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  orgInfo: {
    flex: 1,
  },
  orgTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orgName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  orgCategory: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginBottom: 4,
  },
  orgLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  orgDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  orgStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addOrgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addOrgIcon: {
    marginRight: 16,
  },
  addOrgContent: {
    flex: 1,
  },
  addOrgTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  addOrgDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  addOrgButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addOrgButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});
