import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Card } from '../../src/components/Card';
import { OrgChip } from '../../src/components/OrgChip';
import { theme } from '../../src/theme';

export default function ExploreScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const organizations = [
    { id: '1', name: 'Rocky Mountain Elk Foundation', color: '#059669', logo: 'leaf' },
    { id: '2', name: 'Ecology Project International', color: '#2563EB', logo: 'leaf' },
    { id: '3', name: 'Foster Our Youth', color: '#D97706', logo: 'people' },
  ];

  const opportunities = [
    {
      id: '1',
      title: 'Beach Cleanup at Santa Monica',
      org: 'Ecology Project International',
      date: 'Tomorrow, 9:00 AM',
      location: 'Santa Monica, CA',
      type: 'EVENT',
      coordinate: { latitude: 34.0195, longitude: -118.4912 },
      orgColor: '#2563EB',
      orgLogo: 'leaf',
    },
    {
      id: '2',
      title: 'Wildlife Habitat Restoration',
      org: 'Rocky Mountain Elk Foundation',
      date: 'This Weekend',
      location: 'Malibu, CA',
      type: 'PROJECT',
      coordinate: { latitude: 34.0259, longitude: -118.7798 },
      orgColor: '#059669',
      orgLogo: 'leaf',
    },
    {
      id: '3',
      title: 'Youth Mentorship Program',
      org: 'Foster Our Youth',
      date: 'Next Week',
      location: 'Los Angeles, CA',
      type: 'EVENT',
      coordinate: { latitude: 34.0522, longitude: -118.2437 },
      orgColor: '#D97706',
      orgLogo: 'people',
    },
    {
      id: '4',
      title: 'Community Garden Workshop',
      org: 'Ecology Project International',
      date: 'This Weekend',
      location: 'Venice, CA',
      type: 'EVENT',
      coordinate: { latitude: 33.9850, longitude: -118.4695 },
      orgColor: '#2563EB',
      orgLogo: 'leaf',
    },
    {
      id: '5',
      title: 'Food Bank Volunteer',
      org: 'Foster Our Youth',
      date: 'Next Week',
      location: 'Hollywood, CA',
      type: 'EVENT',
      coordinate: { latitude: 34.0928, longitude: -118.3287 },
      orgColor: '#D97706',
      orgLogo: 'people',
    },
    {
      id: '6',
      title: 'Friendship Forage: Dog Park Cleanup',
      org: 'Community Member',
      date: 'This Weekend',
      location: 'Griffith Park, CA',
      type: 'FRIENDSHIP_FORAGE',
      coordinate: { latitude: 34.1361, longitude: -118.3000 },
      orgColor: '#10B981',
      orgLogo: 'people',
    },
    {
      id: '7',
      title: 'Friendship Forage: Neighborhood Garden',
      org: 'Community Member',
      date: 'Next Week',
      location: 'Silver Lake, CA',
      type: 'FRIENDSHIP_FORAGE',
      coordinate: { latitude: 34.0867, longitude: -118.2708 },
      orgColor: '#10B981',
      orgLogo: 'people',
    },
  ];

  // Default map region (Los Angeles area)
  const initialRegion = {
    latitude: 34.0522,
    longitude: -118.2437,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Opportunities</Text>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons 
                name="map" 
                size={20} 
                color={viewMode === 'map' ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
                Map
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons 
                name="list" 
                size={20} 
                color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Organization Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Organizations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
            <TouchableOpacity
              style={[
                styles.orgChip,
                { backgroundColor: !selectedOrg ? '#10B981' : '#F3F4F6' }
              ]}
              onPress={() => setSelectedOrg(null)}
            >
              <Ionicons 
                name="star" 
                size={16} 
                color={!selectedOrg ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={[
                styles.orgChipText,
                { color: !selectedOrg ? '#FFFFFF' : '#6B7280' }
              ]}>
                All
              </Text>
            </TouchableOpacity>
            {organizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                style={[
                  styles.orgChip,
                  { backgroundColor: selectedOrg === org.id ? org.color : '#F3F4F6' }
                ]}
                onPress={() => setSelectedOrg(org.id)}
              >
                <Ionicons 
                  name={org.logo as any} 
                  size={16} 
                  color={selectedOrg === org.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.orgChipText,
                  { color: selectedOrg === org.id ? '#FFFFFF' : '#6B7280' }
                ]}>
                  {org.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Map/List Content */}
        <View style={styles.contentSection}>
          {viewMode === 'map' ? (
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
              >
                {opportunities
                  .filter(opp => !selectedOrg || opp.org === organizations.find(org => org.id === selectedOrg)?.name)
                  .map((opportunity) => (
                    <Marker
                      key={opportunity.id}
                      coordinate={opportunity.coordinate}
                      title={opportunity.title}
                      description={`${opportunity.org} • ${opportunity.date}`}
                      pinColor={opportunity.orgColor}
                    >
                      <View style={[styles.customMarker, { backgroundColor: opportunity.orgColor }]}>
                        <Ionicons 
                          name={opportunity.orgLogo as any} 
                          size={20} 
                          color="#FFFFFF" 
                        />
                      </View>
                    </Marker>
                  ))}
              </MapView>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {opportunities
                .filter(opp => !selectedOrg || opp.org === organizations.find(org => org.id === selectedOrg)?.name)
                .map((opportunity) => (
                <Card key={opportunity.id} variant="elevated" padding={4} margin={2}>
                  <View style={styles.opportunityItem}>
                    <View style={styles.opportunityHeader}>
                      <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
                      <View style={styles.opportunityType}>
                        <Text style={styles.typeText}>{opportunity.type}</Text>
                      </View>
                    </View>
                    <Text style={styles.opportunityOrg}>{opportunity.org}</Text>
                    <View style={styles.opportunityDetails}>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{opportunity.date}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="location-outline" size={16} color="#6B7280" />
                        <Text style={styles.detailText}>{opportunity.location}</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/create-event')}
      >
        <Text style={styles.fabText}>+ Create Event</Text>
      </TouchableOpacity>
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
    paddingVertical: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#10B981',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  filtersSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filtersScroll: {
    flexDirection: 'row',
  },
  contentSection: {
    flex: 1,
  },
  mapContainer: {
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 12,
    ...theme.elevation.sm,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...theme.elevation.sm,
  },
  orgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orgChipText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  listContainer: {
    gap: 8,
  },
  opportunityItem: {
    flex: 1,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  opportunityType: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  opportunityOrg: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  opportunityDetails: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -80, // Half of width to center
    width: 160,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...theme.elevation.lg,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});