import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Validate environment variables
const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value === 'your_api_key_here' || value === 'your_project_id' || value === 'your_messaging_sender_id_here' || value === 'your_app_id_here')
  .map(([key]) => key);

// Only log missing variables in development, not during build
if (missingVars.length > 0 && process.env.NODE_ENV === 'development') {
  console.error('Missing Firebase environment variables:', missingVars);
  console.error('Please check your .env.local file and ensure all Firebase variables are set.');
  console.error('Visit: https://console.firebase.google.com/ to get your Firebase configuration');
} else if (missingVars.length > 0 && process.env.NODE_ENV === 'production') {
  // In production, log a warning but don't fail the build
  console.warn('Missing Firebase environment variables:', missingVars);
  console.warn('Please configure Firebase environment variables in your deployment platform.');
}

// Check if we have valid Firebase configuration
const hasValidConfig = Object.values(requiredEnvVars).every(
  value => value && value !== 'your_api_key_here' && value !== 'your_project_id' && value !== 'your_messaging_sender_id_here' && value !== 'your_app_id_here'
);

// Initialize Firebase only if we have valid configuration
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;

if (hasValidConfig) {
  const firebaseConfig = {
    apiKey: requiredEnvVars.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: requiredEnvVars.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: requiredEnvVars.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: requiredEnvVars.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();

    // Configure Google provider
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Configuration used:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
      storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
      appId: firebaseConfig.appId ? 'Set' : 'Missing',
    });
    
    // Don't throw error during build, just log it
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Firebase initialization failed, but continuing build...');
    }
  }
} else {
  // Provide mock objects for build time when Firebase config is missing
  if (process.env.NODE_ENV === 'production') {
    console.warn('Firebase configuration missing, using mock objects for build');
  }
}

export { app, auth, db, storage, googleProvider };
