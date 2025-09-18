#!/usr/bin/env node

/**
 * Firebase Configuration Generator
 * This script helps generate the correct Firebase configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Firebase Configuration Generator\n');

// Load current environment variables
const envPath = path.join(process.cwd(), '.env.local');
let currentConfig = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      currentConfig[key] = value;
    }
  });
}

console.log('📋 Current Firebase Configuration:');
console.log(`   Project ID: ${currentConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set'}`);
console.log(`   Auth Domain: ${currentConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'Not set'}`);
console.log(`   API Key: ${currentConfig.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Not set'}`);
console.log(`   Storage Bucket: ${currentConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'Not set'}`);
console.log(`   Messaging Sender ID: ${currentConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'Not set'}`);
console.log(`   App ID: ${currentConfig.NEXT_PUBLIC_FIREBASE_APP_ID || 'Not set'}\n`);

// Generate proper configuration based on existing values
if (currentConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'leli-rentals-52a08') {
  console.log('🎯 Detected leli-rentals-52a08 project. Generating configuration...\n');
  
  const newConfig = {
    ...currentConfig,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: '123456789012',
    NEXT_PUBLIC_FIREBASE_APP_ID: '1:123456789012:web:abcdef1234567890abcdef'
  };
  
  // Update .env.local
  const envContent = Object.entries(newConfig)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Updated Firebase configuration!');
  console.log('📝 Updated values:');
  console.log(`   Messaging Sender ID: ${newConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}`);
  console.log(`   App ID: ${newConfig.NEXT_PUBLIC_FIREBASE_APP_ID}\n`);
  
  console.log('🔧 Next steps:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project: leli-rentals-52a08');
  console.log('3. Go to Project Settings > General');
  console.log('4. Copy the correct Messaging Sender ID and App ID');
  console.log('5. Update your .env.local file with the real values');
  console.log('6. Add authorized domains: 127.0.0.1, localhost');
  
} else {
  console.log('❌ Project ID not recognized. Please manually configure Firebase.');
  console.log('🔗 Go to: https://console.firebase.google.com/');
}