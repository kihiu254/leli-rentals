#!/usr/bin/env node

/**
 * Firebase Configuration Checker
 * This script helps verify that Firebase environment variables are properly configured
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

console.log('🔍 Checking Firebase Configuration...\n');

let allConfigured = true;
const missingVars = [];
const configuredVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  
  if (!value || value === 'your_api_key_here' || value === 'your_project_id' || value.includes('your_')) {
    missingVars.push(varName);
    allConfigured = false;
    console.log(`❌ ${varName}: Missing or placeholder value`);
  } else {
    configuredVars.push(varName);
    console.log(`✅ ${varName}: Configured`);
  }
});

console.log('\n📊 Summary:');
console.log(`✅ Configured: ${configuredVars.length}/${requiredEnvVars.length}`);
console.log(`❌ Missing: ${missingVars.length}/${requiredEnvVars.length}`);

if (allConfigured) {
  console.log('\n🎉 All Firebase environment variables are properly configured!');
  console.log('Your Firebase integration should work correctly.');
} else {
  console.log('\n⚠️  Some Firebase environment variables are missing or have placeholder values.');
  console.log('\n📋 Missing variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n🔧 To fix this:');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
  console.log('2. Select your project and get the configuration values');
  console.log('3. Add them to your deployment platform (Vercel/Render)');
  console.log('4. Or create a .env.local file for local development');
  
  console.log('\n📖 For detailed instructions, see: VERCEL_FIREBASE_SETUP.md');
}

// Check if running in production
if (process.env.NODE_ENV === 'production') {
  console.log('\n🌐 Running in production environment');
  if (!allConfigured) {
    console.log('🚨 CRITICAL: Firebase is not properly configured in production!');
    console.log('   This will cause authentication and database features to fail.');
    process.exit(1);
  }
} else {
  console.log('\n💻 Running in development environment');
}

process.exit(allConfigured ? 0 : 1);
