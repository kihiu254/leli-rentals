import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const colors = {
  primary: '#d97706',
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  text: '#374151',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

export default function BookingScreen({ route }: any) {
  const navigation = useNavigation();
  const { listing } = route.params || {};
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleBook = () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select start and end dates');
      return;
    }
    Alert.alert('Success', 'Booking request sent! You will be contacted soon.');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Book {listing?.title}</Text>
        
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price per day</Text>
          <Text style={styles.price}>₦{listing?.price}</Text>
        </View>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Dates</Text>
          
          <View style={styles.dateInputContainer}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.dateInput}
              placeholder="Start Date (DD/MM/YYYY)"
              placeholderTextColor={colors.textSecondary}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>

          <View style={styles.dateInputContainer}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.dateInput}
              placeholder="End Date (DD/MM/YYYY)"
              placeholderTextColor={colors.textSecondary}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        </View>

        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special requirements or questions..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Item</Text>
            <Text style={styles.summaryValue}>{listing?.title}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>1 day</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price per day</Text>
            <Text style={styles.summaryValue}>₦{listing?.price}</Text>
          </View>
          <View style={[styles.summaryItem, styles.totalItem]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₦{listing?.price}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  priceCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  summarySection: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
