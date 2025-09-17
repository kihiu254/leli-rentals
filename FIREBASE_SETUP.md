# Firebase Authentication Setup Guide

This guide will help you set up Google authentication with Firebase for your Leli Rentals application.

## Prerequisites

1. A Google account
2. A Firebase project
3. Node.js and npm/pnpm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "leli-rentals")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Enable "Google" authentication:
   - Click on "Google"
   - Toggle "Enable"
   - Add your project support email
   - Click "Save"

## Step 3: Set up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the web icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

## Step 5: Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 6: Update Firestore Security Rules

Update your `firestore.rules` file to allow authenticated users to read/write their own data:

```javascript
rules_version='2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other rules for your collections as needed
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev` or `pnpm dev`
2. Navigate to `/login` or `/signup`
3. Try signing in/up with Google
4. Check your Firestore database to see if user data is being saved

## Features Implemented

✅ **Google Sign-in/Sign-up**: Users can authenticate using their Google account
✅ **Email/Password Authentication**: Traditional email and password authentication
✅ **User Data Storage**: User profiles are automatically saved to Firestore
✅ **Profile Management**: User data includes name, email, profile picture, etc.
✅ **Error Handling**: Proper error messages for authentication failures
✅ **Loading States**: UI feedback during authentication processes

## User Data Structure

When a user signs in or signs up, their data is saved to Firestore with this structure:

```javascript
{
  id: "user_uid",
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  phoneNumber: "+1234567890",
  profilePictureUrl: "https://...",
  userType: "renter", // or "owner", "both"
  createdAt: timestamp,
  updatedAt: timestamp,
  isEmailVerified: true,
  provider: "google" // or "email"
}
```

## Troubleshooting

### Quick Diagnosis:

1. **Visit `/env-check`** to verify your environment variables are set
2. **Visit `/test-auth`** to test authentication functionality
3. **Check browser console** for detailed error messages

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Make sure your environment variables are correctly set in `.env.local`
   - Restart your development server after adding environment variables
   - Check `/env-check` page to verify all variables are loaded

2. **"Firebase: Error (auth/popup-closed-by-user)"**
   - User closed the Google sign-in popup
   - This is normal behavior, no action needed

3. **"Firebase: Error (auth/network-request-failed)"**
   - Check your internet connection
   - Verify Firebase project is active
   - Check if Firebase services are enabled in your project

4. **"Firebase: Error (auth/too-many-requests)"**
   - Too many failed authentication attempts
   - Wait a few minutes before trying again

5. **Permission denied in Firestore**
   - Update your Firestore security rules
   - Make sure the user is authenticated
   - Check if your rules are deployed

6. **Buttons not clickable or forms not working**
   - Check browser console for JavaScript errors
   - Verify Firebase is properly initialized
   - Make sure environment variables are set

7. **"Or continue with email" text not visible**
   - Check if CSS is loading properly
   - Verify Tailwind CSS is working
   - Check browser developer tools for styling issues

### Next.js 15 Specific Issues:

- **React 19 Compatibility**: The code is updated for React 19 compatibility
- **Turbopack**: If using `--turbopack`, try without it if you encounter issues
- **Server Components**: Authentication is properly handled in client components

### Environment Variables Checklist:

```bash
# Required variables (check with /env-check page)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Testing Steps:

1. **Start development server**: `npm run dev` or `pnpm dev`
2. **Check environment**: Visit `http://localhost:3000/env-check`
3. **Test authentication**: Visit `http://localhost:3000/test-auth`
4. **Test signup**: Visit `http://localhost:3000/signup`
5. **Test login**: Visit `http://localhost:3000/login`

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev/)
- Check the browser console for detailed error messages
- Use the test pages (`/env-check` and `/test-auth`) for debugging
