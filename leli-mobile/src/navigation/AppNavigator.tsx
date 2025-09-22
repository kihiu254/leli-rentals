import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ListingsScreen from '../screens/ListingsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import MyListingsScreen from '../screens/MyListingsScreen';
import CreateListingScreen from '../screens/CreateListingScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import NotificationScreen from '../screens/NotificationScreen';

// Colors matching website
const colors = {
  primary: '#d97706', // Orange-600
  background: '#ffffff',
  text: '#374151',
  textSecondary: '#6b7280',
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Listings') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: '#e5e7eb',
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: '#e5e7eb',
          borderBottomWidth: 1,
        },
        headerTintColor: colors.primary,
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Leli Rentals' }}
      />
      <Tab.Screen 
        name="Listings" 
        component={ListingsScreen}
        options={{ title: 'Browse Items' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomColor: '#e5e7eb',
            borderBottomWidth: 1,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            color: colors.text,
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen 
          name="ListingDetail" 
          component={ListingDetailScreen}
          options={{ title: 'Item Details' }}
        />
        <Stack.Screen 
          name="Booking" 
          component={BookingScreen}
          options={{ title: 'Book Item' }}
        />
        <Stack.Screen 
          name="MyBookings" 
          component={MyBookingsScreen}
          options={{ title: 'My Bookings' }}
        />
        <Stack.Screen 
          name="MyListings" 
          component={MyListingsScreen}
          options={{ title: 'My Listings' }}
        />
        <Stack.Screen 
          name="CreateListing" 
          component={CreateListingScreen}
          options={{ title: 'List Item' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="About" 
          component={AboutScreen}
          options={{ title: 'About Us' }}
        />
        <Stack.Screen 
          name="Contact" 
          component={ContactScreen}
          options={{ title: 'Contact' }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationScreen}
          options={{ title: 'Notifications' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
