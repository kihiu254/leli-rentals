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

const colors = {
  primary: '#d97706',
  background: '#ffffff',
  backgroundSecondary: '#f9fafb',
  text: '#374151',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
};

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert('Success', 'Message sent successfully! We\'ll get back to you soon.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.subtitle}>
          Have a question or need help? We're here to assist you.
        </Text>

        <View style={styles.contactInfo}>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>support@lelirentals.com</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={24} color={colors.primary} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+234 800 LELI RENT</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={24} color={colors.primary} />
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>Lagos, Nigeria</Text>
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Send us a message</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="What's this about?"
              placeholderTextColor={colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us how we can help..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  contactInfo: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  contactDetails: {
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  form: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
