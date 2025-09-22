// Simple Firebase connection test
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzv5FX8AECAsA0a2--XpMD8GK5NOP1Rhg",
  authDomain: "leli-rentals-52a08.firebaseapp.com",
  projectId: "leli-rentals-52a08",
  storageBucket: "leli-rentals-52a08.firebasestorage.app",
  messagingSenderId: "220739389697",
  appId: "1:220739389697:web:701c8d4141b29d88a13300"
};

async function testFirebaseConnection() {
  console.log('🧪 Testing Firebase Connection...\n');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully');
    
    // Test reading from Firestore
    console.log('📖 Testing Firestore connection...');
    const listingsSnapshot = await getDocs(collection(db, 'listings'));
    console.log('✅ Successfully connected to Firestore');
    console.log(`📊 Found ${listingsSnapshot.size} listings in the database`);
    
    console.log('\n🎉 Firebase connection test passed!');
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    console.log('\n🔧 Possible issues:');
    console.log('1. Internet connectivity problem');
    console.log('2. Firebase project configuration issue');
    console.log('3. Firestore security rules blocking access');
    console.log('4. Firebase project quota exceeded');
  }
}

// Run the test
testFirebaseConnection();
