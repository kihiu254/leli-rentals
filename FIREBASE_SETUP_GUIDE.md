# 🔥 Firebase Authentication Setup Guide

## Current Status
✅ Firebase configuration is now correct with real values:
- Project ID: `leli-rentals-52a08`
- Auth Domain: `leli-rentals-52a08.firebaseapp.com`
- API Key: `AIzaSyDzv5FX8AECAsA0a2---XpMD8GK5N`
- Storage Bucket: `leli-rentals-52a08.appspot.com`
- Messaging Sender ID: `220739389697`
- App ID: `1:220739389697:web:01da5a2bdc78b942a13300`

## 🚨 CRITICAL: Authorized Domains Setup

The `auth/invalid-credential` error is most likely caused by missing authorized domains in Firebase Console.

### Step 1: Configure Authorized Domains
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `leli-rentals-52a08`
3. Go to **Authentication** > **Settings** > **Authorized Domains**
4. Add these domains:
   - `127.0.0.1`
   - `localhost`
   - `leli-rentals-52a08.firebaseapp.com`
   - Your production domain (when ready)

### Step 2: Enable Authentication Methods
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (if needed)
4. Configure any additional providers you want to use

### Step 3: Test Authentication
1. Restart your development server: `npm run dev`
2. Access your app via `http://127.0.0.1:3000` (not localhost)
3. Try logging in with test credentials

## 🔧 Additional Troubleshooting

### If you still get auth/invalid-credential error:

1. **Check Browser Console**: Look for detailed error messages
2. **Verify Environment Variables**: Run `npm run check-firebase`
3. **Test with Different Email**: Try creating a new account first
4. **Check Network Tab**: Look for failed requests to Firebase

### Common Issues:
- **Wrong Domain**: Make sure you're accessing via `127.0.0.1:3000`
- **Missing Authorized Domains**: Add `127.0.0.1` and `localhost`
- **Disabled Authentication**: Enable Email/Password in Firebase Console
- **Invalid API Key**: Verify the API key matches Firebase Console

## 🚀 Production Setup

When deploying to production:
1. Add your production domain to authorized domains
2. Update `NEXT_PUBLIC_APP_URL` in environment variables
3. Configure Firebase Hosting (optional)
4. Set up proper security rules

## 📞 Support

If you're still having issues:
1. Check Firebase Console for any error messages
2. Verify all environment variables are set correctly
3. Test with a fresh Firebase project if needed
4. Contact Firebase support for project-specific issues

---
**Last Updated**: $(date)
**Project**: Leli Rentals
**Firebase Project**: leli-rentals-52a08
