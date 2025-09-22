import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  primary: '#d97706',
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  text: '#374151',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const settingsItems = [
    {
      id: 'profile',
      title: 'Edit Profile',
      icon: 'person-outline',
      action: 'navigate',
    },
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'notifications-outline',
      action: 'toggle',
      value: notifications,
      onToggle: setNotifications,
    },
    {
      id: 'darkMode',
      title: 'Dark Mode',
      icon: 'moon-outline',
      action: 'toggle',
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-outline',
      action: 'navigate',
    },
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: 'document-text-outline',
      action: 'navigate',
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      action: 'navigate',
    },
    {
      id: 'logout',
      title: 'Sign Out',
      icon: 'log-out-outline',
      action: 'logout',
      destructive: true,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => {
              if (item.action === 'toggle' && item.onToggle) {
                item.onToggle(!item.value);
              }
            }}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons 
                  name={item.icon as any} 
                  size={24} 
                  color={item.destructive ? '#ef4444' : colors.primary} 
                />
              </View>
              <Text style={[
                styles.settingTitle,
                item.destructive && styles.destructiveText
              ]}>
                {item.title}
              </Text>
            </View>
            
            {item.action === 'toggle' ? (
              <Switch
                value={item.value}
                onValueChange={item.onToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            ) : (
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ))}
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
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  destructiveText: {
    color: '#ef4444',
  },
});
