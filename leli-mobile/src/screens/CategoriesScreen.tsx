import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const colors = {
  primary: '#d97706',
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  text: '#374151',
  textSecondary: '#6b7280',
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  orange: '#f97316',
};

const categories = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    description: 'Cars, motorcycles, trucks & more',
    count: '1,800+ listings',
    icon: 'car-outline',
    color: colors.blue,
    bgColor: '#dbeafe',
  },
  {
    id: 'equipment',
    name: 'Equipment',
    description: 'Professional & DIY tools',
    count: '3,200+ listings',
    icon: 'construct-outline',
    color: colors.orange,
    bgColor: '#fed7aa',
  },
  {
    id: 'homes',
    name: 'Homes & Apartments',
    description: 'Short-term rentals & vacation homes',
    count: '2,500+ listings',
    icon: 'home-outline',
    color: colors.green,
    bgColor: '#a7f3d0',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets, computers & tech accessories',
    count: '950+ listings',
    icon: 'laptop-outline',
    color: colors.purple,
    bgColor: '#ddd6fe',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing, jewelry & accessories',
    count: '1,200+ listings',
    icon: 'shirt-outline',
    color: colors.pink,
    bgColor: '#fce7f3',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Music, gaming & entertainment',
    count: '850+ listings',
    icon: 'musical-notes-outline',
    color: colors.indigo,
    bgColor: '#e0e7ff',
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Cameras, lighting & production gear',
    count: '600+ listings',
    icon: 'camera-outline',
    color: colors.cyan,
    bgColor: '#a5f3fc',
  },
  {
    id: 'tools',
    name: 'Tools',
    description: 'Professional & DIY tools',
    count: '900+ listings',
    icon: 'hammer-outline',
    color: colors.textSecondary,
    bgColor: '#f3f4f6',
  },
];

export default function CategoriesScreen() {
  const navigation = useNavigation();

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Listings' as never, { category: categoryId } as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
        <Text style={styles.headerSubtitle}>
          Explore thousands of items across all categories
        </Text>
      </View>

      {/* Categories Grid */}
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.id)}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
              <Ionicons name={category.icon as any} size={32} color={category.color} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
            <Text style={[styles.categoryCount, { color: category.color }]}>
              {category.count}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Platform Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={24} color={colors.blue} />
            <Text style={styles.statNumber}>10,000+</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color={colors.green} />
            <Text style={styles.statNumber}>8,000+</Text>
            <Text style={styles.statLabel}>Items Available</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="shield-checkmark-outline" size={24} color={colors.purple} />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Secure</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: (screenWidth - 48) / 2,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.backgroundSecondary,
    marginTop: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
