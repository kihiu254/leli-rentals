// Test script to debug listing creation issues
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function testListingCreation() {
  console.log('🧪 Testing Firebase Listing Creation...\n');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    console.log('✅ Firebase initialized successfully');
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous authentication successful:', userCredential.user.uid);
    
    // Test listing creation
    console.log('📝 Testing listing creation...');
    const testListing = {
      title: 'Test Listing',
      description: 'This is a test listing',
      price: 50,
      category: 'tech',
      location: 'Test Location',
      rating: 0,
      reviews: 0,
      image: '/placeholder.svg',
      images: ['/placeholder.svg'],
      amenities: [],
      available: true,
      owner: {
        id: userCredential.user.uid,
        name: 'Test User',
        avatar: '/placeholder.svg',
        rating: 0,
        verified: true
      },
      ownerId: userCredential.user.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'listings'), testListing);
    console.log('✅ Test listing created successfully with ID:', docRef.id);
    
    // Test reading listings
    console.log('📖 Testing listing retrieval...');
    const listingsSnapshot = await getDocs(collection(db, 'listings'));
    console.log('✅ Successfully retrieved', listingsSnapshot.size, 'listings');
    
    console.log('\n🎉 All tests passed! Firebase listing functionality is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.message) {
      console.error('Error message:', error.message);
    }
    
    console.log('\n🔧 Troubleshooting suggestions:');
    console.log('1. Check your Firebase configuration in .env.local');
    console.log('2. Verify Firestore security rules allow listing creation');
    console.log('3. Ensure you have internet connectivity');
    console.log('4. Check Firebase project status in console.firebase.google.com');
  }
}

// Run the test
testListingCreation().then(() => {
  console.log('\nTest completed.');
  process.exit(0);
}).catch((error) => {
  console.error('Test script failed:', error);
  process.exit(1);
});
