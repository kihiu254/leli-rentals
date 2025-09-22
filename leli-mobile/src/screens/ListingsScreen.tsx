import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
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
  border: '#e5e7eb',
};

// Mock data for listings
const mockListings = [
  {
    id: '1',
    title: 'Luxury BMW X5',
    category: 'vehicles',
    price: 150,
    location: 'Lagos, Nigeria',
    image: '/luxury-cars-in-modern-showroom.jpg',
    rating: 4.8,
    reviews: 24,
    owner: 'John Doe',
  },
  {
    id: '2',
    title: 'Professional Camera Kit',
    category: 'photography',
    price: 75,
    location: 'Abuja, Nigeria',
    image: '/professional-construction-and-industrial-equipment.jpg',
    rating: 4.9,
    reviews: 18,
    owner: 'Jane Smith',
  },
  {
    id: '3',
    title: 'Modern Apartment',
    category: 'homes',
    price: 200,
    location: 'Port Harcourt, Nigeria',
    image: '/modern-apartment-city-view.png',
    rating: 4.7,
    reviews: 32,
    owner: 'Mike Johnson',
  },
];

export default function ListingsScreen({ route }: any) {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(route?.params?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || '');
  const [listings] = useState(mockListings);

  const categories = [
    { id: '', name: 'All', icon: 'grid-outline' },
    { id: 'vehicles', name: 'Vehicles', icon: 'car-outline' },
    { id: 'homes', name: 'Homes', icon: 'home-outline' },
    { id: 'electronics', name: 'Electronics', icon: 'laptop-outline' },
    { id: 'equipment', name: 'Equipment', icon: 'construct-outline' },
  ];

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderListingItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.listingCard}
      onPress={() => navigation.navigate('ListingDetail' as never, { listing: item } as never)}
    >
      <Image source={{ uri: item.image }} style={styles.listingImage} />
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingLocation}>
          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
          {' '}{item.location}
        </Text>
        <View style={styles.listingFooter}>
          <Text style={styles.listingPrice}>₦{item.price}/day</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewsText}>({item.reviews})</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon as any} 
              size={16} 
              color={selectedCategory === category.id ? colors.background : colors.textSecondary} 
            />
            <Text style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredListings.length} listings found
        </Text>
      </View>

      {/* Listings Grid */}
      <FlatList
        data={filteredListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listingsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    padding: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  categoryScroll: {
    maxHeight: 60,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.background,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  listingCard: {
    width: (screenWidth - 48) / 2,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listingImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  listingContent: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginLeft: 2,
  },
  reviewsText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
