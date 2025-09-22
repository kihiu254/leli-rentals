import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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

export default function ListingDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { listing } = route.params || {};

  const handleBook = () => {
    navigation.navigate('Booking' as never, { listing } as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image source={{ uri: listing?.image }} style={styles.image} />
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>{listing?.title}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.location}>{listing?.location}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>{listing?.rating}</Text>
            <Text style={styles.reviews}>({listing?.reviews} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₦{listing?.price}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>
              This is a high-quality item perfect for your needs. 
              Well-maintained and ready for immediate use.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features</Text>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Insurance included</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>24/7 support</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
              <Text style={styles.featureText}>Flexible pickup</Text>
            </View>
          </View>

          <View style={styles.ownerContainer}>
            <Text style={styles.ownerTitle}>Owner</Text>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerInitial}>{listing?.owner?.charAt(0)}</Text>
              </View>
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{listing?.owner}</Text>
                <Text style={styles.ownerRating}>⭐ 4.9 (24 reviews)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.bottomPrice}>₦{listing?.price}/day</Text>
          <Text style={styles.bottomPriceUnit}>Starting from</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: screenWidth,
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 4,
    fontWeight: '600',
  },
  reviews: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  priceUnit: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  ownerContainer: {
    marginBottom: 100,
  },
  ownerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.background,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  ownerRating: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  priceInfo: {
    flex: 1,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bottomPriceUnit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
