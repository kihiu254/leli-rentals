#!/usr/bin/env node

/**
 * Database Deployment Script
 * 
 * This script helps deploy Firestore rules and indexes to Firebase.
 * Run this after making changes to firestore.rules or firestore.indexes.json
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database deployment...\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Firebase CLI is not installed. Please install it first:');
  console.error('   npm install -g firebase-tools');
  console.error('   or');
  console.error('   yarn global add firebase-tools');
  process.exit(1);
}

// Check if user is logged in to Firebase
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Not logged in to Firebase. Please run:');
  console.error('   firebase login');
  process.exit(1);
}

// Check if firebase.json exists
const firebaseConfigPath = path.join(process.cwd(), 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json not found. Please initialize Firebase:');
  console.error('   firebase init firestore');
  process.exit(1);
}

// Check if firestore.rules exists
const rulesPath = path.join(process.cwd(), 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules not found');
  process.exit(1);
}

// Check if firestore.indexes.json exists
const indexesPath = path.join(process.cwd(), 'firestore.indexes.json');
if (!fs.existsSync(indexesPath)) {
  console.error('❌ firestore.indexes.json not found');
  process.exit(1);
}

console.log('✅ Prerequisites check passed\n');

// Deploy Firestore rules
console.log('📋 Deploying Firestore rules...');
try {
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Firestore rules deployed successfully\n');
} catch (error) {
  console.error('❌ Failed to deploy Firestore rules');
  console.error('Error:', error.message);
  process.exit(1);
}

// Deploy Firestore indexes
console.log('📊 Deploying Firestore indexes...');
try {
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log('✅ Firestore indexes deployed successfully\n');
} catch (error) {
  console.error('❌ Failed to deploy Firestore indexes');
  console.error('Error:', error.message);
  process.exit(1);
}

console.log('🎉 Database deployment completed successfully!');
console.log('\n📝 Next steps:');
console.log('1. Test your application to ensure all queries work correctly');
console.log('2. Monitor the Firebase Console for any index build errors');
console.log('3. Check query performance in the Firebase Console');
console.log('4. Update your application code if needed');

console.log('\n🔗 Useful links:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Firestore Rules: https://console.firebase.google.com/project/[PROJECT_ID]/firestore/rules');
console.log('- Firestore Indexes: https://console.firebase.google.com/project/[PROJECT_ID]/firestore/indexes');
