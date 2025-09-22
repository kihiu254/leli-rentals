import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

const menuItems = [
  {
    id: 'bookings',
    title: 'My Bookings',
    subtitle: 'View your rental history',
    icon: 'calendar-outline',
    screen: 'MyBookings',
  },
  {
    id: 'listings',
    title: 'My Listings',
    subtitle: 'Manage your items',
    icon: 'list-outline',
    screen: 'MyListings',
  },
  {
    id: 'create',
    title: 'List an Item',
    subtitle: 'Earn money by renting',
    icon: 'add-circle-outline',
    screen: 'CreateListing',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Stay updated',
    icon: 'notifications-outline',
    screen: 'Notifications',
  },
  {
    id: 'settings',
    title: 'Settings',
    subtitle: 'Account preferences',
    icon: 'settings-outline',
    screen: 'Settings',
  },
  {
    id: 'about',
    title: 'About Us',
    subtitle: 'Learn more about Leli',
    icon: 'information-circle-outline',
    screen: 'About',
  },
  {
    id: 'contact',
    title: 'Contact',
    subtitle: 'Get in touch',
    icon: 'mail-outline',
    screen: 'Contact',
  },
];

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleMenuPress = (item: any) => {
    if (item.screen) {
      navigation.navigate(item.screen as never);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login' as never);
  };

  const handleSignup = () => {
    navigation.navigate('Signup' as never);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100x100/d97706/ffffff?text=U' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userName}>Welcome to Leli Rentals</Text>
        <Text style={styles.userEmail}>Sign in to access your account</Text>
        
        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.signupButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Listings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => handleMenuPress(item)}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>Leli Rentals v1.0.0</Text>
        <Text style={styles.appDescription}>
          Your trusted platform for rentals
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundSecondary,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  authButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  loginButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  signupButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuSection: {
    backgroundColor: colors.background,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
