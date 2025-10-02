import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useColorScheme,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { OrgChip, MapPin, Card, LoadingState, EmptyState, AnimatedButton } from '../components';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

interface FeedItem {
  id: string;
  orgId: string;
  orgName: string;
  orgLogoUrl?: string;
  orgPrimaryColor?: string;
  kind: 'EVENT' | 'NEWS' | 'PROJECT';
  title: string;
  summary?: string;
  location?: [number, number];
  startsAt?: string;
  endsAt?: string;
  url?: string;
  imageUrl?: string;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const MapFeedScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
  const [selectedKinds, setSelectedKinds] = useState<string[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 39.8283, // Center of US
    longitude: -98.5795,
    latitudeDelta: 15, // Show more of the US
    longitudeDelta: 15,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // TODO: Replace with actual API calls
      // const [feedResponse, orgsResponse] = await Promise.all([
      //   apiClient.get('/feed/map', { params: { ...region, cluster: true } }),
      //   apiClient.get('/organizations/following'),
      // ]);
      
      // Mock data for demo - spread across different locations
      const mockFeedItems: FeedItem[] = [
        {
          id: '1',
          orgId: 'rmef-1',
          orgName: 'Rocky Mountain Elk Foundation',
          orgPrimaryColor: '#059669',
          kind: 'EVENT',
          title: 'Elk Habitat Restoration',
          summary: 'Join us for habitat restoration in Lolo National Forest',
          location: [-114.0199, 46.8721], // Missoula, MT
          startsAt: '2024-02-15T08:00:00Z',
          endsAt: '2024-02-15T16:00:00Z',
          createdAt: '2024-01-15T00:00:00Z',
        },
        {
          id: '2',
          orgId: 'epi-1',
          orgName: 'Ecology Project International',
          orgPrimaryColor: '#0EA5E9',
          kind: 'EVENT',
          title: 'Student Field Research',
          summary: 'High school students conduct water quality research',
          location: [-121.8863, 36.6002], // Monterey, CA
          startsAt: '2024-02-20T09:00:00Z',
          endsAt: '2024-02-20T15:00:00Z',
          createdAt: '2024-01-20T00:00:00Z',
        },
        {
          id: '3',
          orgId: 'foy-1',
          orgName: 'Foster Our Youth',
          orgPrimaryColor: '#8B5CF6',
          kind: 'EVENT',
          title: 'Life Skills Workshop',
          summary: 'Teaching foster youth essential money management skills',
          location: [-118.2437, 34.0522], // Los Angeles, CA
          startsAt: '2024-02-25T14:00:00Z',
          endsAt: '2024-02-25T17:00:00Z',
          createdAt: '2024-01-25T00:00:00Z',
        },
        {
          id: '4',
          orgId: 'rmef-1',
          orgName: 'Rocky Mountain Elk Foundation',
          orgPrimaryColor: '#059669',
          kind: 'NEWS',
          title: 'Elk Population Reaches Record High',
          summary: 'Conservation efforts show positive results across Montana',
          location: [-110.3626, 31.9686], // Tucson, AZ
          createdAt: '2024-02-01T00:00:00Z',
        },
        {
          id: '5',
          orgId: 'foy-1',
          orgName: 'Foster Our Youth',
          orgPrimaryColor: '#8B5CF6',
          kind: 'PROJECT',
          title: 'College Readiness Initiative',
          summary: 'Supporting foster youth through college preparation',
          location: [-87.6298, 41.8781], // Chicago, IL
          createdAt: '2024-02-05T00:00:00Z',
        },
        {
          id: '6',
          orgId: 'epi-1',
          orgName: 'Ecology Project International',
          orgPrimaryColor: '#0EA5E9',
          kind: 'PROJECT',
          title: 'Marine Biology Research',
          summary: 'Long-term study of kelp forest ecosystems',
          location: [-122.4194, 37.7749], // San Francisco, CA
          createdAt: '2024-02-10T00:00:00Z',
        },
        {
          id: '7',
          orgId: 'rmef-1',
          orgName: 'Rocky Mountain Elk Foundation',
          orgPrimaryColor: '#059669',
          kind: 'EVENT',
          title: 'Wildlife Photography Workshop',
          summary: 'Learn to capture stunning wildlife photos',
          location: [-105.2705, 40.0150], // Denver, CO
          startsAt: '2024-02-28T10:00:00Z',
          endsAt: '2024-02-28T16:00:00Z',
          createdAt: '2024-02-12T00:00:00Z',
        },
        {
          id: '8',
          orgId: 'foy-1',
          orgName: 'Foster Our Youth',
          orgPrimaryColor: '#8B5CF6',
          kind: 'NEWS',
          title: 'Mentorship Program Expansion',
          summary: 'New mentorship opportunities in 5 additional cities',
          location: [-74.0060, 40.7128], // New York, NY
          createdAt: '2024-02-15T00:00:00Z',
        },
      ];

      const mockOrganizations: Organization[] = [
        {
          id: 'rmef-1',
          name: 'Rocky Mountain Elk Foundation',
          primaryColor: '#059669',
        },
        {
          id: 'epi-1',
          name: 'Ecology Project International',
          primaryColor: '#0EA5E9',
        },
        {
          id: 'foy-1',
          name: 'Foster Our Youth',
          primaryColor: '#8B5CF6',
        },
      ];

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      setFeedItems(mockFeedItems);
      setOrganizations(mockOrganizations);
    } catch (error) {
      console.error('Error loading feed data:', error);
      Alert.alert('Error', 'Failed to load feed data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const handleOrgToggle = (orgId: string) => {
    setSelectedOrgs(prev => 
      prev.includes(orgId) 
        ? prev.filter(id => id !== orgId)
        : [...prev, orgId]
    );
  };

  const handleKindToggle = (kind: string) => {
    setSelectedKinds(prev => 
      prev.includes(kind) 
        ? prev.filter(k => k !== kind)
        : [...prev, kind]
    );
  };

  const filteredItems = feedItems.filter(item => {
    const orgMatch = selectedOrgs.length === 0 || selectedOrgs.includes(item.orgId);
    const kindMatch = selectedKinds.length === 0 || selectedKinds.includes(item.kind);
    return orgMatch && kindMatch;
  });

  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    // TODO: Load new items based on region
  };

  const getKindColor = (kind: string) => {
    switch (kind) {
      case 'EVENT':
        return theme.colors.semantic.info;
      case 'NEWS':
        return theme.colors.semantic.warning;
      case 'PROJECT':
        return theme.colors.semantic.success;
      default:
        return theme.colors.neutral.gray[500];
    }
  };

  const getKindIcon = (kind: string) => {
    switch (kind) {
      case 'EVENT':
        return 'calendar-outline';
      case 'NEWS':
        return 'newspaper-outline';
      case 'PROJECT':
        return 'briefcase-outline';
      default:
        return 'ellipse-outline';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderMapView = () => {
    // Group items by location to handle clustering
    const locationGroups = new Map<string, FeedItem[]>();
    
    filteredItems.forEach((item) => {
      if (!item.location) return;
      
      const key = `${item.location[0]},${item.location[1]}`;
      if (!locationGroups.has(key)) {
        locationGroups.set(key, []);
      }
      locationGroups.get(key)!.push(item);
    });

    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
          showsUserLocation
          showsMyLocationButton
          showsCompass={false}
          showsScale={false}
          mapType="standard"
        >
          {Array.from(locationGroups.entries()).map(([locationKey, items]) => {
            const [longitude, latitude] = locationKey.split(',').map(Number);
            const primaryItem = items[0];
            
            // Add small random offset to prevent exact overlap
            const offsetLat = latitude + (Math.random() - 0.5) * 0.01;
            const offsetLng = longitude + (Math.random() - 0.5) * 0.01;
            
            return (
              <Marker
                key={locationKey}
                coordinate={{
                  latitude: offsetLat,
                  longitude: offsetLng,
                }}
                title={items.length > 1 ? `${items.length} opportunities` : primaryItem.title}
                description={items.length > 1 ? `Multiple opportunities in this area` : primaryItem.orgName}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <MapPin
                  kind={primaryItem.kind}
                  title={items.length > 1 ? `${items.length}` : primaryItem.title}
                  orgName={items.length > 1 ? 'Multiple' : primaryItem.orgName}
                  orgPrimaryColor={primaryItem.orgPrimaryColor}
                  size={items.length > 1 ? "lg" : "md"}
                  isCluster={items.length > 1}
                />
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  };

  const renderListView = () => (
    <ScrollView 
      style={styles.listContainer} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.semantic.info}
          colors={[theme.colors.semantic.info]}
        />
      }
    >
      {filteredItems.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No items found"
          description="Try adjusting your filters or check back later for new content."
          actionText="Clear Filters"
          onAction={() => {
            setSelectedOrgs([]);
            setSelectedKinds([]);
          }}
        />
      ) : (
        filteredItems.map((item) => (
          <Card
            key={item.id}
            variant="elevated"
            padding={4}
            margin={2}
            pressable
            onPress={() => Alert.alert(item.title, item.summary || 'No summary available')}
            style={styles.listItemCard}
          >
            <View style={styles.listItemHeader}>
              <View style={styles.listItemLeft}>
                <View style={[
                  styles.kindIndicator,
                  { backgroundColor: getKindColor(item.kind) }
                ]}>
                  <Ionicons 
                    name={getKindIcon(item.kind)} 
                    size={12} 
                    color={theme.colors.neutral.white} 
                  />
                </View>
                <View style={styles.listItemInfo}>
                  <Text style={[styles.listItemTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.listItemOrg, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
                    {item.orgName}
                  </Text>
                </View>
              </View>
              <View style={styles.listItemRight}>
                <Text style={[styles.listItemDate, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
                  {formatRelativeTime(item.createdAt)}
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[400]} 
                />
              </View>
            </View>
            {item.summary && (
              <Text style={[styles.listItemSummary, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600] }]}>
                {item.summary}
              </Text>
            )}
            {item.startsAt && (
              <View style={styles.listItemFooter}>
                <Ionicons 
                  name="time-outline" 
                  size={14} 
                  color={isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500]} 
                />
                <Text style={[styles.listItemTime, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
                  {formatEventTime(item.startsAt)}
                </Text>
              </View>
            )}
          </Card>
        ))
      )}
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
        <LoadingState 
          message="Loading your feed..." 
          size="large" 
          variant="centered" 
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[900] : theme.colors.neutral.gray[50] }]} edges={['top']}>
      {/* Header with View Toggle */}
      <Card 
        variant="elevated" 
        padding={4} 
        margin={0}
        style={[styles.header, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={[styles.headerTitle, { color: isDark ? theme.colors.dark.neutral.gray[100] : theme.colors.neutral.gray[900] }]}>
              Explore
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[600] }]}>
              {filteredItems.length} opportunities found
            </Text>
          </View>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === 'map' && styles.toggleButtonActive,
                { backgroundColor: viewMode === 'map' ? theme.colors.semantic.info : 'transparent' },
              ]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons 
                name="map-outline" 
                size={16} 
                color={viewMode === 'map' ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600])} 
              />
              <Text style={[styles.toggleButtonText, { color: viewMode === 'map' ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600]) }]}>
                Map
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                viewMode === 'list' && styles.toggleButtonActive,
                { backgroundColor: viewMode === 'list' ? theme.colors.semantic.info : 'transparent' },
              ]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons 
                name="list-outline" 
                size={16} 
                color={viewMode === 'list' ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600])} 
              />
              <Text style={[styles.toggleButtonText, { color: viewMode === 'list' ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600]) }]}>
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Organization Filters */}
      <View style={[styles.filtersSection, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}>
        <Text style={[styles.filterSectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
          Organizations
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <OrgChip
            id="all"
            name="All"
            selected={selectedOrgs.length === 0}
            onPress={() => setSelectedOrgs([])}
            size="sm"
          />
          {organizations.map((org) => (
            <OrgChip
              key={org.id}
              id={org.id}
              name={org.name}
              logoUrl={org.logoUrl}
              primaryColor={org.primaryColor}
              selected={selectedOrgs.includes(org.id)}
              onPress={() => handleOrgToggle(org.id)}
              size="sm"
            />
          ))}
        </ScrollView>
      </View>

      {/* Kind Filters */}
      <View style={[styles.filtersSection, { backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white }]}>
        <Text style={[styles.filterSectionTitle, { color: isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700] }]}>
          Content Type
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {['EVENT', 'NEWS', 'PROJECT'].map((kind) => (
            <TouchableOpacity
              key={kind}
              style={[
                styles.kindFilter,
                {
                  backgroundColor: selectedKinds.includes(kind) 
                    ? getKindColor(kind)
                    : (isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[100]),
                  borderColor: selectedKinds.includes(kind) 
                    ? getKindColor(kind)
                    : (isDark ? theme.colors.dark.neutral.gray[600] : theme.colors.neutral.gray[300]),
                },
              ]}
              onPress={() => handleKindToggle(kind)}
            >
              <Ionicons 
                name={getKindIcon(kind)} 
                size={14} 
                color={selectedKinds.includes(kind) ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600])} 
              />
              <Text style={[styles.kindFilterText, { color: selectedKinds.includes(kind) ? theme.colors.neutral.white : (isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600]) }]}>
                {kind}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Content */}
      {viewMode === 'map' ? renderMapView() : renderListView()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[200],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral.gray[100],
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing[1],
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing[1],
  },
  toggleButtonActive: {
    // Active styles handled by backgroundColor
  },
  toggleButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filtersSection: {
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray[200],
  },
  filterSectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing[2],
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  filtersContainer: {
    flexGrow: 0,
  },
  filtersContent: {
    paddingRight: theme.spacing[4],
  },
  kindFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    marginRight: theme.spacing[2],
    gap: theme.spacing[1],
  },
  kindFilterText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
    paddingTop: theme.spacing[3],
  },
  listItemCard: {
    marginBottom: theme.spacing[3],
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemInfo: {
    flex: 1,
    marginLeft: theme.spacing[3],
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  kindIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItemDate: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  listItemTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 2,
    lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.base,
  },
  listItemOrg: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  listItemSummary: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.sm,
    marginBottom: theme.spacing[2],
  },
  listItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[1],
  },
  listItemTime: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
