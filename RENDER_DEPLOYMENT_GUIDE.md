# Render Deployment Guide for Leli Rentals

## 🚀 Deploy Your App to Render

### Step 1: Prepare Your Repository
1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

### Step 2: Create Render Account
1. Go to [Render.com](https://render.com/)
2. Sign up with your GitHub account
3. Connect your GitHub repository

### Step 3: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `kihiu254/leli-rentals`
3. Configure the service:

#### Basic Settings:
- **Name**: `leli-rentals`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node Version**: `18` or `20`

#### Advanced Settings:
- **Auto-Deploy**: `Yes` (deploy on every push)
- **Branch**: `main`
- **Root Directory**: Leave empty (uses project root)

### Step 4: Add Environment Variables
In Render dashboard → Your Service → Environment:

#### Required Environment Variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_complete_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=leli-rentals-52a08.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=leli-rentals-52a08
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=leli-rentals-52a08.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_complete_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_complete_app_id
```

### Step 5: Get Complete Firebase Values
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `leli-rentals-52a08`
3. Click gear icon ⚙️ → **Project Settings**
4. Scroll to **"Your apps"** section
5. Click on your web app
6. Copy the **complete** configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDzv5FX8AECAsA0a2---XpMD8GK5N...", // Complete key
  authDomain: "leli-rentals-52a08.firebaseapp.com",
  projectId: "leli-rentals-52a08",
  storageBucket: "leli-rentals-52a08.appspot.com",
  messagingSenderId: "123456789012", // Complete number
  appId: "1:123456789012:web:abcdef1234567890" // Complete app ID
};
```

### Step 6: Update Firebase Authorized Domains
1. Go to Firebase Console → **Authentication** → **Settings**
2. Add authorized domains:
   - `localhost` (for development)
   - `leli-rentals.onrender.com` (your Render domain)
   - `your-custom-domain.com` (if you have one)

### Step 7: Deploy
1. Click **"Create Web Service"** in Render
2. Wait for the build to complete (5-10 minutes)
3. Your app will be available at: `https://leli-rentals.onrender.com`

## 🔧 Troubleshooting

### Common Issues:

#### Build Fails:
- Check Node version compatibility
- Ensure all dependencies are in `package.json`
- Check build logs for specific errors

#### Firebase Not Working:
- Verify all environment variables are set correctly
- Check Firebase Console for authorized domains
- Ensure Google Auth is enabled

#### App Crashes:
- Check Render logs for errors
- Verify environment variables are complete
- Test locally first

### Step 8: Test Firebase Functionality
After deployment, test:
1. **Google Sign-In**: Should work without termination
2. **AI Chat**: Should function properly
3. **User Authentication**: Should persist across sessions
4. **Database Operations**: Should work correctly

## 📊 Monitoring
- **Render Dashboard**: Monitor deployments and logs
- **Firebase Console**: Monitor authentication and database usage
- **Browser Console**: Check for client-side errors

## 🔄 Continuous Deployment
- Every push to `main` branch will trigger automatic deployment
- Environment variables persist across deployments
- Rollback available if needed

## 💡 Pro Tips
- Use Render's free tier for testing
- Upgrade to paid plan for production use
- Set up custom domain for professional appearance
- Monitor performance and usage metrics

## 🆘 Need Help?
- Check Render documentation: https://render.com/docs
- Firebase documentation: https://firebase.google.com/docs
- Check deployment logs for specific errors
