# Deployment Guide for Leli Rentals

This guide will help you deploy your Leli Rentals application to Vercel or Render.

## Prerequisites

1. A Firebase project set up (see `FIREBASE_SETUP.md`)
2. A GitHub repository with your code
3. Accounts on Vercel or Render

## Environment Variables Required

You need to set up the following environment variables in your deployment platform:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Deployment to Vercel

### Step 1: Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables
1. In your project settings, go to "Environment Variables"
2. Add each Firebase environment variable:
   - Click "Add New"
   - Enter the variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Enter the variable value
   - Select "Production", "Preview", and "Development" environments
   - Click "Save"

### Step 3: Deploy
1. Click "Deploy" to start the deployment
2. Vercel will automatically build and deploy your application
3. Your app will be available at `https://your-project-name.vercel.app`

## Deployment to Render

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Select your repository and branch

### Step 2: Configure Build Settings
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` or `20`

### Step 3: Set Environment Variables
1. In your service settings, go to "Environment"
2. Add each Firebase environment variable:
   - Click "Add Environment Variable"
   - Enter the key and value
   - Click "Save Changes"

### Step 4: Deploy
1. Click "Create Web Service"
2. Render will build and deploy your application
3. Your app will be available at `https://your-service-name.onrender.com`

## Getting Firebase Configuration Values

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project

### Step 2: Get Web App Configuration
1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app, click "Add app" and select the web icon (`</>`)
5. Register your app with a nickname
6. Copy the configuration object

### Step 3: Extract Values
From the configuration object, extract these values:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key-here",           // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project-id.firebaseapp.com", // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "project-id",              // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project-id.appspot.com", // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",       // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abcdef"       // → NEXT_PUBLIC_FIREBASE_APP_ID
};
```

## Troubleshooting

### Build Errors
If you encounter build errors related to Firebase:

1. **Missing Environment Variables**: Ensure all Firebase environment variables are set
2. **Invalid API Key**: Verify your Firebase API key is correct
3. **Project ID Mismatch**: Check that your project ID matches across all variables

### Runtime Errors
If the app builds but doesn't work:

1. **Authentication Issues**: Check Firebase Auth is enabled in your project
2. **Database Access**: Ensure Firestore is enabled and rules are set
3. **Storage Access**: Verify Firebase Storage is enabled

### Environment Variable Checklist
Before deploying, verify you have:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - Your Firebase API key
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Your project domain
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Your project ID
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Your storage bucket
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Your messaging sender ID
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - Your app ID

## Testing Your Deployment

After deployment:

1. **Visit your app URL**
2. **Test authentication**:
   - Try signing up with email/password
   - Try signing in with Google
3. **Test core features**:
   - Browse listings
   - Add to favorites
   - Create bookings
4. **Check browser console** for any errors

## Security Notes

- Never commit `.env.local` files to version control
- Use environment variables for all sensitive configuration
- Regularly rotate your Firebase API keys
- Set up proper Firestore security rules

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Firebase services are enabled in your project
4. Check the deployment platform logs for build errors

For more help, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
