# 🚀 Quick Firebase Setup Guide

## The Issue
Your app is showing `Firebase: Error (auth/invalid-api-key)` because the Firebase environment variables are not set up yet.

## Quick Fix (5 minutes)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it: `leli-rentals`
4. Enable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication
1. In Firebase Console, click **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"**
5. Enable **"Google"**:
   - Click **"Google"**
   - Toggle **"Enable"**
   - Add your email
   - Click **"Save"**

### Step 3: Set up Firestore
1. Click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in test mode"**
4. Select location (choose closest to you)
5. Click **"Done"**

### Step 4: Get Configuration
1. Click **⚙️ Project settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web icon** (`</>`)
4. Name it: `leli-rentals-web`
5. **Copy the config object** (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 5: Create Environment File
Create a file called `.env.local` in your project root with this content:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

**Replace the placeholder values with your actual Firebase config values!**

### Step 6: Restart Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ That's It!
After these steps, your authentication should work perfectly!

## 🔍 Still Having Issues?
- Check that `.env.local` file is in the project root (same level as `package.json`)
- Make sure you restarted the development server
- Check browser console for any remaining errors
- Verify all environment variables are set (not showing "your_api_key_here")

## 📞 Need Help?
- Firebase Console: https://console.firebase.google.com/
- Firebase Docs: https://firebase.google.com/docs
- Check the `FIREBASE_SETUP.md` file for detailed instructions
