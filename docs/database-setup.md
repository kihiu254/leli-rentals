# Database Setup Guide - Leli Rentals

This guide will help you set up the database connection for the Leli Rentals onboarding system.

## Prerequisites

1. **Firebase Project**: You need a Firebase project set up
2. **Firestore Database**: Enable Firestore in your Firebase project
3. **Authentication**: Enable Authentication in your Firebase project

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Leli Rentals
NODE_ENV=development
```

## Firebase Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "Leli Rentals"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### 3. Enable Authentication
1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable "Google" provider

### 4. Get Firebase Configuration
1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web" (</> icon)
4. Enter app nickname: "Leli Rentals Web"
5. Copy the configuration object

### 5. Set Up Security Rules
In Firestore Database → Rules, replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User onboarding data
    match /userOnboarding/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User preferences
    match /userPreferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User verifications
    match /userVerifications/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User profiles
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow public read access to categories (if needed)
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Database Collections

The system will automatically create the following collections:

### 1. userOnboarding
- Stores user onboarding progress and data
- Document ID: User's Firebase Auth UID

### 2. userPreferences
- Stores user preferences and settings
- Document ID: User's Firebase Auth UID

### 3. userVerifications
- Stores verification data and status
- Document ID: User's Firebase Auth UID

### 4. userProfiles
- Extended user profile data
- Document ID: User's Firebase Auth UID

## Testing the Setup

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Test the Onboarding Flow
1. Go to `http://localhost:3000/get-started`
2. Select a user type
3. Go through the onboarding process
4. Check Firebase Console → Firestore Database to see data being saved

### 3. Verify API Endpoints
Test the API endpoints:

```bash
# Test onboarding data save
curl -X POST http://localhost:3000/api/onboarding \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","step":1,"userType":"renter"}'

# Test preferences save
curl -X POST http://localhost:3000/api/user-preferences \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","preferredCategories":["vehicles"]}'
```

## Troubleshooting

### Common Issues

#### 1. "Firebase is not initialized" Error
- Check that all environment variables are set correctly
- Ensure `.env.local` file is in the project root
- Restart the development server after adding environment variables

#### 2. "Permission denied" Error
- Check Firestore security rules
- Ensure user is authenticated
- Verify the user ID matches the document ID

#### 3. "Network request failed" Error
- Check internet connection
- Verify Firebase project is active
- Check Firebase project quota limits

#### 4. Environment Variables Not Loading
- Ensure file is named `.env.local` (not `.env`)
- Restart the development server
- Check for typos in variable names

### Debug Mode

To enable debug logging, set in your `.env.local`:
```env
NODE_ENV=development
```

This will show detailed Firebase connection logs in the browser console.

## Production Deployment

### 1. Update Security Rules
For production, update Firestore rules to be more restrictive:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow authenticated users to access their own data
    match /userOnboarding/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true;
    }
    
    // Add similar rules for other collections...
  }
}
```

### 2. Environment Variables
Set environment variables in your deployment platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Heroku: Config Vars

### 3. Database Indexes
Create composite indexes for better performance:
- `userId` + `createdAt`
- `userId` + `onboardingCompleted`
- `verificationStatus` + `createdAt`

## Monitoring

### 1. Firebase Console
- Monitor usage in Firebase Console → Usage tab
- Check error logs in Firebase Console → Functions → Logs

### 2. Application Monitoring
- Add error tracking (Sentry, LogRocket)
- Monitor API response times
- Track onboarding completion rates

## Backup Strategy

### 1. Automated Backups
- Enable Firestore automated backups
- Set up daily exports to Cloud Storage
- Test restore procedures regularly

### 2. Data Export
```bash
# Export all collections
gcloud firestore export gs://your-backup-bucket/backup-$(date +%Y%m%d)
```

## Security Best Practices

### 1. Data Validation
- Always validate data on the server side
- Use TypeScript interfaces for type safety
- Implement rate limiting for API endpoints

### 2. User Privacy
- Encrypt sensitive data (phone numbers, addresses)
- Implement data retention policies
- Provide user data export/deletion options

### 3. Access Control
- Use Firebase Auth for user authentication
- Implement role-based access control
- Regular security rule audits

## Support

If you encounter issues:

1. Check the [Firebase Documentation](https://firebase.google.com/docs)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Check the project's GitHub issues
4. Contact the development team

## Next Steps

After setting up the database:

1. **Test the complete onboarding flow**
2. **Set up user authentication**
3. **Configure email/SMS verification**
4. **Implement data analytics**
5. **Set up monitoring and alerts**
