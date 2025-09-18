#!/usr/bin/env node

/**
 * Firebase Configuration Helper
 * This script helps you get the correct Firebase configuration values
 */

console.log('🔥 Firebase Configuration Helper\n');

console.log('📋 Follow these steps to get your Firebase configuration:\n');

console.log('1. 🌐 Go to Firebase Console:');
console.log('   https://console.firebase.google.com/\n');

console.log('2. 🎯 Select your project:');
console.log('   leli-rentals-52a08\n');

console.log('3. ⚙️  Go to Project Settings:');
console.log('   Click the gear icon → Project Settings\n');

console.log('4. 📱 Find your web app:');
console.log('   Scroll down to "Your apps" section\n');

console.log('5. 🔧 Get configuration:');
console.log('   Click on your web app (or create one if it doesn\'t exist)\n');

console.log('6. 📋 Copy the configuration object:');
console.log('   It should look like this:\n');

console.log('   const firebaseConfig = {');
console.log('     apiKey: "AIzaSyDzv5FX8AECAsA0a2---XpMD8GK5N...",');
console.log('     authDomain: "leli-rentals-52a08.firebaseapp.com",');
console.log('     projectId: "leli-rentals-52a08",');
console.log('     storageBucket: "leli-rentals-52a08.appspot.com",');
console.log('     messagingSenderId: "123456789012",');
console.log('     appId: "1:123456789012:web:abcdef1234567890"');
console.log('   };\n');

console.log('7. 📝 Update your .env.local file with these values:\n');

console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDzv5FX8AECAsA0a2---XpMD8GK5N...');
console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=leli-rentals-52a08.firebaseapp.com');
console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=leli-rentals-52a08');
console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=leli-rentals-52a08.appspot.com');
console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012');
console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890\n');

console.log('8. 🔄 Restart your development server:');
console.log('   npm run dev\n');

console.log('9. ✅ Test the configuration:');
console.log('   npm run check-firebase\n');

console.log('🚨 IMPORTANT NOTES:');
console.log('• Make sure to copy the COMPLETE values (not truncated)');
console.log('• The API key should be much longer than what\'s shown in Vercel');
console.log('• The messaging sender ID should be a complete number');
console.log('• The app ID should include the full format: "1:number:web:hash"\n');

console.log('🔍 If you\'re still having issues:');
console.log('• Check that Google Authentication is enabled in Firebase Console');
console.log('• Verify authorized domains include localhost and your deployment domain');
console.log('• Make sure the .env.local file is in your project root directory\n');

console.log('📖 For more help, see: FIREBASE_SETUP_COMPLETE.md');
