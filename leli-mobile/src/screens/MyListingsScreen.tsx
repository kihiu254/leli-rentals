import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function MyListingsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Listings Yet</Text>
          <Text style={styles.emptySubtitle}>
            Start earning by listing your items for rent
          </Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateListing' as never)}
          >
            <Text style={styles.createButtonText}>Create Listing</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
