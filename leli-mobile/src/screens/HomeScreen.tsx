import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Website colors exactly matching
const colors = {
  primary: '#d97706', // Orange-600
  background: '#ffffff',
  backgroundSecondary: '#f9fafb', // Gray-50
  text: '#374151', // Gray-700
  textSecondary: '#6b7280', // Gray-500
  white: '#ffffff',
  black: '#000000',
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
};

const categories = [
  {
    id: 'vehicles',
    name: 'Vehicles',
    description: 'Cars, motorcycles, trucks & more',
    count: '1,800+ listings',
    icon: 'car-outline',
    color: colors.blue,
  },
  {
    id: 'equipment',
    name: 'Equipment',
    description: 'Professional & DIY tools',
    count: '3,200+ listings',
    icon: 'construct-outline',
    color: colors.primary,
  },
  {
    id: 'homes',
    name: 'Homes & Apartments',
    description: 'Short-term rentals & vacation homes',
    count: '2,500+ listings',
    icon: 'home-outline',
    color: colors.green,
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets, computers & tech accessories',
    count: '950+ listings',
    icon: 'laptop-outline',
    color: colors.purple,
  },
];

const features = [
  {
    icon: 'search-outline',
    title: 'Easy Search',
    description: 'Find exactly what you need with our powerful search and filtering system.',
  },
  {
    icon: 'checkmark-circle-outline',
    title: 'Verified Listings',
    description: 'All our rentals are verified and quality-checked for your peace of mind.',
  },
  {
    icon: 'flash-outline',
    title: 'Instant Booking',
    description: 'Book instantly with our streamlined reservation system.',
  },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Listings' as never, { search: searchQuery } as never);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('Listings' as never, { category: categoryId } as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section - Exact match to website */}
      <LinearGradient
        colors={[colors.primary, '#f59e0b']}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Find Your Perfect Rental</Text>
          <Text style={styles.heroSubtitle}>
            Discover amazing rentals for every occasion.{'\n'}
            From cars to equipment, we've got you covered.
          </Text>
          
          {/* Search Bar - Exact match to website */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="What are you looking for?"
                placeholderTextColor={colors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
            </View>
            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Features Section - Exact match to website */}
      <View style={[styles.featuresSection, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Why Choose Leli Rentals?
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Experience the future of rentals with our modern platform
          </Text>
        </View>

        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={[styles.featureCard, { backgroundColor: colors.background }, styles.shadow]}>
              <View style={[styles.featureIcon, { backgroundColor: colors.backgroundSecondary }]}>
                <Ionicons name={feature.icon as any} size={32} color={colors.primary} />
              </View>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Categories Section - Exact match to website */}
      <View style={[styles.categoriesSection, { backgroundColor: colors.background }]}>
        <View style={styles.sectionHeader}>
          <View style={styles.popularBadge}>
            <Ionicons name="star" size={16} color={colors.white} />
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Popular Categories
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Discover our most popular rental categories with thousands of verified listings
          </Text>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity 
              key={category.id} 
              style={[styles.categoryCard, styles.shadow]}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={32} color={colors.white} />
              </View>
              <Text style={[styles.categoryName, { color: colors.text }]}>
                {category.name}
              </Text>
              <Text style={[styles.categoryDescription, { color: colors.textSecondary }]}>
                {category.description}
              </Text>
              <Text style={[styles.categoryCount, { color: colors.primary }]}>
                {category.count}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* View All Categories CTA */}
        <TouchableOpacity 
          style={[styles.viewAllButton, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('Categories' as never)}
        >
          <Text style={[styles.viewAllButtonText, { color: colors.primary }]}>
            View All Categories
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.primary} />
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
  
  // Hero Section - Exact match to website
  heroSection: {
    height: screenHeight * 0.5,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: screenWidth,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
    lineHeight: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 16,
    marginHorizontal: 16,
    backgroundColor: colors.background,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 16,
    color: colors.text,
  },
  searchButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  searchButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Features Section - Exact match to website
  featuresSection: {
    paddingVertical: 64,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 64,
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    maxWidth: screenWidth * 0.8,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (screenWidth - 60) / 3,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Categories Section - Exact match to website
  categoriesSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    marginBottom: 24,
  },
  popularBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 64,
  },
  categoryCard: {
    width: (screenWidth - 60) / 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    alignSelf: 'center',
  },
  viewAllButtonText: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 8,
  },
  
  // Shadow utility
  shadow: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
});
