# Complete Firebase Setup Guide

## 🚨 Current Issue
Your sign-in process is being terminated because Firebase is not properly initialized. This happens when environment variables are missing or incomplete.

## 🔧 Step-by-Step Solution

### Step 1: Get Complete Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `leli-rentals-52a08`
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Click on your web app (or create one if it doesn't exist)
6. Copy the **complete** configuration values

### Step 2: Create .env.local File
Create a file named `.env.local` in your project root with this content:

```bash
# Firebase Configuration for Local Development
NEXT_PUBLIC_FIREBASE_API_KEY=your_complete_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=leli-rentals-52a08.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=leli-rentals-52a08
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=leli-rentals-52a08.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_complete_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_complete_app_id_here
```

### Step 3: Get Complete Values from Firebase Console
From your Firebase Console, you need to get the **complete** values. The image shows truncated values:

**Example of what you need:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDzv5FX8AECAsA0a2---XpMD8GK5N...", // Complete key (not truncated)
  authDomain: "leli-rentals-52a08.firebaseapp.com",
  projectId: "leli-rentals-52a08",
  storageBucket: "leli-rentals-52a08.appspot.com",
  messagingSenderId: "123456789012", // Complete number
  appId: "1:123456789012:web:abcdef1234567890" // Complete app ID
};
```

### Step 4: Update Vercel Environment Variables
In your Vercel dashboard, make sure you have the **complete** values (not truncated):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update each variable with the complete values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` - Complete API key
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Complete sender ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID` - Complete app ID

### Step 5: Enable Google Authentication in Firebase
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Google** provider
3. Add your domain to authorized domains:
   - `localhost` (for development)
   - `leli-rentals-ekyk.vercel.app` (for production)

### Step 6: Test the Configuration
Run this command to check your Firebase configuration:
```bash
npm run check-firebase
```

### Step 7: Restart Development Server
After creating `.env.local`:
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## 🔍 Troubleshooting

### If Sign-in Still Fails:
1. **Check Browser Console** for specific error messages
2. **Verify Environment Variables** are complete (not truncated)
3. **Check Firebase Console** for any project restrictions
4. **Ensure Google Auth** is enabled in Firebase Console

### Common Issues:
- **Truncated API Keys**: Make sure you copy the complete values
- **Missing Environment Variables**: All 6 variables must be set
- **Domain Not Authorized**: Add your domains to Firebase authorized domains
- **Google Auth Not Enabled**: Enable Google provider in Firebase Console

## ✅ Verification Checklist
- [ ] `.env.local` file created with complete values
- [ ] Vercel environment variables updated with complete values
- [ ] Google authentication enabled in Firebase Console
- [ ] Authorized domains added to Firebase Console
- [ ] Development server restarted
- [ ] `npm run check-firebase` passes
- [ ] Sign-in process works without termination

## 📞 Still Having Issues?
If you're still experiencing problems:
1. Check the browser console for specific error messages
2. Verify all environment variables are complete (not truncated)
3. Ensure Firebase project is properly configured
4. Check Firebase Console for any restrictions or issues
