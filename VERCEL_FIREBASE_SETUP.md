# Firebase Environment Variables Setup for Vercel

## 🚨 Current Issue
Your Vercel deployment is missing Firebase environment variables, causing:
- Firebase authentication to fail
- Google Sign-In not working
- AI chat functionality errors
- Database operations failing

## 🔧 Solution: Add Firebase Environment Variables to Vercel

### Step 1: Get Your Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `leli-rentals-52a08`
3. Click the gear icon ⚙️ → **Project Settings**
4. Scroll down to **Your apps** section
5. Click on your web app (or create one if it doesn't exist)
6. Copy the configuration values

### Step 2: Add Environment Variables to Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `leli-rentals`
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add each of these variables:

#### Required Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=leli-rentals-52a08.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=leli-rentals-52a08
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=leli-rentals-52a08.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### Step 3: Environment Configuration
For each variable:
- **Name**: Use the exact variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
- **Value**: Paste your actual Firebase configuration value
- **Environment**: Select all three:
  - ✅ Production
  - ✅ Preview  
  - ✅ Development

### Step 4: Redeploy
1. After adding all variables, go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger automatic deployment

## 🔍 How to Find Your Firebase Values

### From Firebase Console:
1. **API Key**: Found in the config object as `apiKey`
2. **Auth Domain**: Usually `your-project-id.firebaseapp.com`
3. **Project ID**: Your project ID (e.g., `leli-rentals-52a08`)
4. **Storage Bucket**: Usually `your-project-id.appspot.com`
5. **Messaging Sender ID**: Found in the config object
6. **App ID**: Found in the config object as `appId`

### Example Firebase Config:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "leli-rentals-52a08.firebaseapp.com", // ← NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "leli-rentals-52a08", // ← NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "leli-rentals-52a08.appspot.com", // ← NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789", // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123" // ← NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## ✅ Verification
After redeployment, check:
1. **Google Sign-In** should work
2. **AI Chat** should function without errors
3. **User authentication** should work
4. **Database operations** should succeed
5. **Console errors** should be resolved

## 🚨 Important Notes
- All variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Never commit actual Firebase keys to your repository
- Keep your Firebase keys secure and don't share them publicly
- If you're unsure about any value, double-check in Firebase Console

## 📞 Need Help?
If you're still having issues:
1. Check Vercel deployment logs for any errors
2. Verify all environment variables are set correctly
3. Ensure Firebase project is properly configured
4. Check Firebase Console for any project restrictions
