import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Card } from '../src/components/Card';
import { theme } from '../src/theme';

export default function CreateEventScreen() {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
  });

  const handleLocationSelect = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSubmitEvent = () => {
    if (!eventTitle.trim() || !eventDescription.trim() || !eventDate.trim() || !eventTime.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Here you would normally submit to your API
    Alert.alert(
      'Friendship Forage Created!',
      'Your event has been submitted and will appear on the map once approved.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const initialRegion = {
    latitude: 34.0522,
    longitude: -118.2437,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        {/* Event Form */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Event Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Beach Cleanup with Friends"
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Describe your Friendship Forage..."
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.dateTimeRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="MM/DD/YYYY"
                value={eventDate}
                onChangeText={setEventDate}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="HH:MM AM/PM"
                value={eventTime}
                onChangeText={setEventTime}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </Card>

        {/* Location Selection */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Select Location</Text>
          <Text style={styles.sectionSubtitle}>Tap on the map to choose where your event will take place</Text>
          
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={initialRegion}
              onPress={handleLocationSelect}
              showsUserLocation={true}
              showsMyLocationButton={true}
            >
              <Marker
                coordinate={selectedLocation}
                title="Event Location"
                description="Tap map to change location"
              >
                <View style={styles.customMarker}>
                  <Text style={styles.markerEmoji}>🤝</Text>
                </View>
              </Marker>
            </MapView>
          </View>
        </Card>

        {/* Friendship Forage Info */}
        <Card variant="elevated" padding={4} margin={4}>
          <View style={styles.infoContainer}>
            <View style={styles.infoIcon}>
              <Text style={styles.infoEmoji}>🤝</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>What is a Friendship Forage?</Text>
              <Text style={styles.infoDescription}>
                Friendship Forages are community events created by users like you. They're informal gatherings 
                where people come together to make a positive impact while building connections.
              </Text>
            </View>
          </View>
        </Card>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitEvent}>
          <Text style={styles.submitButtonText}>Create Friendship Forage</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    ...theme.elevation.sm,
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...theme.elevation.sm,
  },
  markerEmoji: {
    fontSize: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
    ...theme.elevation.sm,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
