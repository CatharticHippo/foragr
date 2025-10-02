import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
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
  const [selectedEventType, setSelectedEventType] = useState('');
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [customStartTime, setCustomStartTime] = useState('');
  const [customEndTime, setCustomEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 34.0522,
    longitude: -118.2437,
  });

  // Top 5 volunteering event types with suggestions
  const eventTypes = [
    {
      id: '1',
      title: 'Beach Cleanup',
      description: 'Help clean up beaches and coastal areas',
      icon: 'water',
      color: '#2563EB',
      suggestions: {
        title: 'Beach Cleanup at [Location]',
        description: 'Join us for a beach cleanup to protect marine life and keep our coastlines beautiful. We\'ll provide gloves, bags, and refreshments.',
        time: '9:00 AM - 12:00 PM'
      }
    },
    {
      id: '2',
      title: 'Community Garden',
      description: 'Help maintain and grow community gardens',
      icon: 'leaf',
      color: '#059669',
      suggestions: {
        title: 'Community Garden Work Day',
        description: 'Help us maintain our community garden! We\'ll be planting, weeding, and harvesting fresh produce for local families.',
        time: '8:00 AM - 11:00 AM'
      }
    },
    {
      id: '3',
      title: 'Food Bank Volunteer',
      description: 'Sort and distribute food to those in need',
      icon: 'restaurant',
      color: '#D97706',
      suggestions: {
        title: 'Food Bank Sorting & Distribution',
        description: 'Help sort donations and prepare food packages for families in need. No experience necessary - we\'ll show you everything!',
        time: '10:00 AM - 2:00 PM'
      }
    },
    {
      id: '4',
      title: 'Animal Shelter Help',
      description: 'Care for animals and help with shelter operations',
      icon: 'heart',
      color: '#DC2626',
      suggestions: {
        title: 'Animal Shelter Volunteer Day',
        description: 'Help care for our furry friends! We\'ll be walking dogs, socializing cats, and helping with general shelter maintenance.',
        time: '1:00 PM - 4:00 PM'
      }
    },
    {
      id: '5',
      title: 'Senior Center Activities',
      description: 'Engage with seniors through activities and companionship',
      icon: 'people',
      color: '#7C3AED',
      suggestions: {
        title: 'Senior Center Game Day',
        description: 'Join us for an afternoon of games, crafts, and conversation with our senior community members. Bring your smile and positive energy!',
        time: '2:00 PM - 5:00 PM'
      }
    }
  ];

  // Date suggestions (next 30 days)
  const getDateSuggestions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const isToday = i === 0;
      const isTomorrow = i === 1;
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      let label = '';
      if (isToday) label = 'Today';
      else if (isTomorrow) label = 'Tomorrow';
      else if (i < 7) label = dayName;
      else label = `${dayName}, ${monthDay}`;
      
      dates.push({
        id: i.toString(),
        label,
        value: date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit' 
        }).replace(/\//g, '/'),
        date: date
      });
    }
    return dates;
  };

  // Time suggestions with more granular options
  const timeSuggestions = [
    { id: '1', label: 'Early Morning', value: '7:00 AM - 10:00 AM', icon: 'sunny', type: 'preset' },
    { id: '2', label: 'Morning', value: '9:00 AM - 12:00 PM', icon: 'sunny', type: 'preset' },
    { id: '3', label: 'Afternoon', value: '1:00 PM - 4:00 PM', icon: 'partly-sunny', type: 'preset' },
    { id: '4', label: 'Late Afternoon', value: '3:00 PM - 6:00 PM', icon: 'cloudy', type: 'preset' },
    { id: '5', label: 'Evening', value: '6:00 PM - 9:00 PM', icon: 'moon', type: 'preset' },
    { id: '6', label: 'All Day', value: '9:00 AM - 5:00 PM', icon: 'time', type: 'preset' },
    { id: '7', label: 'Custom Time', value: '', icon: 'create', type: 'custom' },
  ];

  // Generate hourly time slots for custom selection
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const time12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeString = `${time12}:00 ${ampm}`;
      slots.push({
        id: `custom-${hour}`,
        label: timeString,
        value: timeString,
        hour: hour,
        type: 'custom'
      });
    }
    return slots;
  };

  const handleLocationSelect = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleEventTypeSelect = (eventType: any) => {
    setSelectedEventType(eventType.title);
    setEventTitle(eventType.suggestions.title);
    setEventDescription(eventType.suggestions.description);
    setEventTime(eventType.suggestions.time);
    setShowEventTypeModal(false);
  };

  const getSelectedEventType = () => {
    return eventTypes.find(type => type.title === selectedEventType);
  };

  const handleDateSelect = (dateItem: any) => {
    setEventDate(dateItem.value);
    setShowDateModal(false);
  };

  const handleCalendarDateSelect = (date: Date) => {
    setSelectedDate(date);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '/');
    setEventDate(formattedDate);
    setShowDateModal(false);
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === currentMonth;
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected = currentDate.toDateString() === selectedDate.toDateString();
      const isPast = currentDate < today && !isToday;
      
      days.push({
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        isPast,
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleTimeSelect = (timeItem: any) => {
    if (timeItem.type === 'custom') {
      setShowTimeModal(false);
      setShowCustomTimeModal(true);
    } else {
      setEventTime(timeItem.value);
      setShowTimeModal(false);
    }
  };

  const handleCustomTimeSubmit = () => {
    if (customStartTime && customEndTime) {
      setEventTime(`${customStartTime} - ${customEndTime}`);
      setShowCustomTimeModal(false);
      setCustomStartTime('');
      setCustomEndTime('');
    }
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Event</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Event Summary */}
        {(selectedEventType || eventDate || eventTime) && (
          <Card variant="elevated" padding={4} margin={4}>
            <Text style={styles.sectionTitle}>Event Summary</Text>
            <View style={styles.summaryContainer}>
              {selectedEventType && (
                <View style={styles.summaryItem}>
                  <View style={[styles.summaryIcon, { backgroundColor: getSelectedEventType()?.color }]}>
                    <Ionicons 
                      name={getSelectedEventType()?.icon as any} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <Text style={styles.summaryLabel}>Type:</Text>
                  <Text style={styles.summaryValue}>{selectedEventType}</Text>
                </View>
              )}
              {eventDate && (
                <View style={styles.summaryItem}>
                  <Ionicons name="calendar" size={16} color="#10B981" />
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>{eventDate}</Text>
                </View>
              )}
              {eventTime && (
                <View style={styles.summaryItem}>
                  <Ionicons name="time" size={16} color="#10B981" />
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{eventTime}</Text>
                </View>
              )}
            </View>
          </Card>
        )}

        {/* Event Type Selection */}
        <Card variant="elevated" padding={4} margin={4}>
          <Text style={styles.sectionTitle}>Choose Event Type</Text>
          <Text style={styles.sectionSubtitle}>Select a popular event type to auto-fill suggestions</Text>
          
          <TouchableOpacity 
            style={styles.eventTypeSelector}
            onPress={() => setShowEventTypeModal(true)}
          >
            <View style={styles.eventTypeContent}>
              {selectedEventType ? (
                <View style={styles.selectedEventType}>
                  <View style={[styles.eventTypeIcon, { backgroundColor: getSelectedEventType()?.color }]}>
                    <Ionicons 
                      name={getSelectedEventType()?.icon as any} 
                      size={20} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.eventTypeText}>
                    <Text style={styles.eventTypeTitle}>{selectedEventType}</Text>
                    <Text style={styles.eventTypeDescription}>{getSelectedEventType()?.description}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.eventTypePlaceholder}>
                  <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
                  <Text style={styles.eventTypePlaceholderText}>Tap to choose event type</Text>
                </View>
              )}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </Card>

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
              <TouchableOpacity 
                style={[styles.selectorInput, eventDate && styles.selectorInputSelected]}
                onPress={() => setShowDateModal(true)}
              >
                <Text style={[styles.selectorText, !eventDate && styles.selectorPlaceholder]}>
                  {eventDate || 'Select date'}
                </Text>
                <View style={styles.selectorIconContainer}>
                  {eventDate && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color="#10B981" 
                      style={styles.checkIcon}
                    />
                  )}
                  <Ionicons 
                    name="calendar-outline" 
                    size={20} 
                    color={eventDate ? "#10B981" : "#6B7280"} 
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time *</Text>
              <TouchableOpacity 
                style={[styles.selectorInput, eventTime && styles.selectorInputSelected]}
                onPress={() => setShowTimeModal(true)}
              >
                <Text style={[styles.selectorText, !eventTime && styles.selectorPlaceholder]}>
                  {eventTime || 'Select time'}
                </Text>
                <View style={styles.selectorIconContainer}>
                  {eventTime && (
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color="#10B981" 
                      style={styles.checkIcon}
                    />
                  )}
                  <Ionicons 
                    name="time-outline" 
                    size={20} 
                    color={eventTime ? "#10B981" : "#6B7280"} 
                  />
                </View>
              </TouchableOpacity>
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
                  <Ionicons name="people" size={20} color="#FFFFFF" />
                </View>
              </Marker>
            </MapView>
          </View>
        </Card>

        {/* Friendship Forage Info */}
        <Card variant="elevated" padding={4} margin={4}>
          <View style={styles.infoContainer}>
            <View style={styles.infoIcon}>
              <Ionicons name="people" size={24} color="#10B981" />
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

      {/* Event Type Selection Modal */}
      <Modal
        visible={showEventTypeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEventTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Event Type</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowEventTypeModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={eventTypes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.eventTypeItem}
                  onPress={() => handleEventTypeSelect(item)}
                >
                  <View style={[styles.eventTypeItemIcon, { backgroundColor: item.color }]}>
                    <Ionicons name={item.icon as any} size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.eventTypeItemContent}>
                    <Text style={styles.eventTypeItemTitle}>{item.title}</Text>
                    <Text style={styles.eventTypeItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Calendar Date Selection Modal */}
      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Date</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowDateModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                style={styles.calendarNavButton}
                onPress={() => navigateMonth('prev')}
              >
                <Ionicons name="chevron-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              
              <Text style={styles.calendarMonthTitle}>
                {getMonthName(selectedDate)}
              </Text>
              
              <TouchableOpacity 
                style={styles.calendarNavButton}
                onPress={() => navigateMonth('next')}
              >
                <Ionicons name="chevron-forward" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Calendar Days of Week */}
            <View style={styles.calendarDaysHeader}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <Text key={day} style={styles.calendarDayHeader}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    !day.isCurrentMonth && styles.calendarDayOtherMonth,
                    day.isToday && styles.calendarDayToday,
                    day.isSelected && styles.calendarDaySelected,
                    day.isPast && styles.calendarDayPast,
                  ]}
                  onPress={() => !day.isPast && handleCalendarDateSelect(day.date)}
                  disabled={day.isPast}
                >
                  <Text style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                    day.isToday && styles.calendarDayTextToday,
                    day.isSelected && styles.calendarDayTextSelected,
                    day.isPast && styles.calendarDayTextPast,
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Quick Date Options */}
            <View style={styles.quickDateOptions}>
              <Text style={styles.quickDateLabel}>Quick Options:</Text>
              <View style={styles.quickDateButtons}>
                <TouchableOpacity 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const today = new Date();
                    handleCalendarDateSelect(today);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    handleCalendarDateSelect(tomorrow);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickDateButton}
                  onPress={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    handleCalendarDateSelect(nextWeek);
                  }}
                >
                  <Text style={styles.quickDateButtonText}>Next Week</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Selection Modal */}
      <Modal
        visible={showTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Time</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowTimeModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={timeSuggestions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.dateTimeItem, item.type === 'custom' && styles.customTimeItem]}
                  onPress={() => handleTimeSelect(item)}
                >
                  <View style={[styles.dateTimeItemIcon, item.type === 'custom' && styles.customTimeIcon]}>
                    <Ionicons name={item.icon as any} size={24} color={item.type === 'custom' ? '#6B7280' : '#10B981'} />
                  </View>
                  <View style={styles.dateTimeItemContent}>
                    <Text style={[styles.dateTimeItemLabel, item.type === 'custom' && styles.customTimeLabel]}>
                      {item.label}
                    </Text>
                    {item.value && (
                      <Text style={styles.dateTimeItemValue}>{item.value}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Custom Time Selection Modal */}
      <Modal
        visible={showCustomTimeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Custom Time</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowCustomTimeModal(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.customTimeContainer}>
              <Text style={styles.customTimeSubtitle}>Choose start and end times</Text>
              
              <View style={styles.timeInputRow}>
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeInputLabel}>Start Time</Text>
                  <TouchableOpacity 
                    style={styles.timeInputButton}
                    onPress={() => {
                      // In a real app, you'd open a time picker here
                      // For now, we'll use a simple text input
                    }}
                  >
                    <TextInput
                      style={styles.timeInputText}
                      placeholder="9:00 AM"
                      value={customStartTime}
                      onChangeText={setCustomStartTime}
                      placeholderTextColor="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.timeInputGroup}>
                  <Text style={styles.timeInputLabel}>End Time</Text>
                  <TouchableOpacity 
                    style={styles.timeInputButton}
                    onPress={() => {
                      // In a real app, you'd open a time picker here
                      // For now, we'll use a simple text input
                    }}
                  >
                    <TextInput
                      style={styles.timeInputText}
                      placeholder="5:00 PM"
                      value={customEndTime}
                      onChangeText={setCustomEndTime}
                      placeholderTextColor="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.quickTimeButtons}>
                <Text style={styles.quickTimeLabel}>Quick Options:</Text>
                <View style={styles.quickTimeRow}>
                  <TouchableOpacity 
                    style={styles.quickTimeButton}
                    onPress={() => {
                      setCustomStartTime('9:00 AM');
                      setCustomEndTime('12:00 PM');
                    }}
                  >
                    <Text style={styles.quickTimeButtonText}>9 AM - 12 PM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickTimeButton}
                    onPress={() => {
                      setCustomStartTime('1:00 PM');
                      setCustomEndTime('4:00 PM');
                    }}
                  >
                    <Text style={styles.quickTimeButtonText}>1 PM - 4 PM</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.quickTimeRow}>
                  <TouchableOpacity 
                    style={styles.quickTimeButton}
                    onPress={() => {
                      setCustomStartTime('6:00 PM');
                      setCustomEndTime('9:00 PM');
                    }}
                  >
                    <Text style={styles.quickTimeButtonText}>6 PM - 9 PM</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickTimeButton}
                    onPress={() => {
                      setCustomStartTime('9:00 AM');
                      setCustomEndTime('5:00 PM');
                    }}
                  >
                    <Text style={styles.quickTimeButtonText}>All Day</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.customTimeSubmitButton, (!customStartTime || !customEndTime) && styles.disabledButton]}
                onPress={handleCustomTimeSubmit}
                disabled={!customStartTime || !customEndTime}
              >
                <Text style={styles.customTimeSubmitText}>Set Custom Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Event Type Selector Styles
  eventTypeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventTypeContent: {
    flex: 1,
  },
  selectedEventType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventTypeText: {
    flex: 1,
  },
  eventTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  eventTypeDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  eventTypePlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTypePlaceholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventTypeItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventTypeItemContent: {
    flex: 1,
  },
  eventTypeItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventTypeItemDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Selector Input Styles
  selectorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectorText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  selectorPlaceholder: {
    color: '#9CA3AF',
  },
  selectorInputSelected: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  selectorIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 6,
  },
  // Date/Time Item Styles
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dateTimeItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dateTimeItemContent: {
    flex: 1,
  },
  dateTimeItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  dateTimeItemValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  // Custom Time Styles
  customTimeItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 16,
  },
  customTimeIcon: {
    backgroundColor: '#F3F4F6',
  },
  customTimeLabel: {
    color: '#6B7280',
  },
  customTimeContainer: {
    padding: 20,
  },
  customTimeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  timeInputGroup: {
    flex: 1,
  },
  timeInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  timeInputButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeInputText: {
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  quickTimeButtons: {
    marginBottom: 24,
  },
  quickTimeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  quickTimeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickTimeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  quickTimeButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  customTimeSubmitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  customTimeSubmitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  // Summary Styles
  summaryContainer: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 8,
    minWidth: 40,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  // Calendar Styles
  calendarModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayToday: {
    backgroundColor: '#FEF3C7',
  },
  calendarDaySelected: {
    backgroundColor: '#10B981',
  },
  calendarDayPast: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  calendarDayTextOtherMonth: {
    color: '#9CA3AF',
  },
  calendarDayTextToday: {
    color: '#D97706',
    fontWeight: '600',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarDayTextPast: {
    color: '#9CA3AF',
  },
  quickDateOptions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  quickDateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 12,
  },
  quickDateButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDateButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  quickDateButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
});
