# Render Deployment Guide

This guide will help you deploy your Leli Rentals application to Render and set up any additional services you need.

## 🚀 Quick Start

### 1. Prepare Your Application

Your application is now clean of Neon and GraphQL dependencies. It's ready to deploy with just Firebase integration.

### 2. Create Render Account

1. Go to [render.com](https://render.com/)
2. Sign up with your GitHub account
3. Verify your email address

### 3. Deploy Your Web Service

1. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Build Settings**
   ```
   Name: leli-rentals
   Environment: Node
   Region: Oregon (US West)
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**
   Add these variables in the Render dashboard:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your app
   - Your app will be available at `https://your-app-name.onrender.com`

## 🗄️ Optional: PostgreSQL Database

If you need a database in the future, you can add a Render PostgreSQL service:

### 1. Create PostgreSQL Service
1. Go to Render dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   ```
   Name: leli-rentals-db
   Database: leli_rentals
   User: leli_user
   Region: Oregon (US West)
   ```

### 2. Get Connection String
1. Go to your PostgreSQL service
2. Copy the "External Database URL"
3. Add to your web service environment variables:
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   ```

## 🔧 Render Features You Can Use

### 1. Auto-Deploy
- Automatic deployments on git push to main branch
- Preview deployments for pull requests

### 2. Custom Domains
- Add your own domain in the service settings
- Free SSL certificates

### 3. Environment Management
- Separate environments for staging/production
- Environment-specific variables

### 4. Monitoring
- Built-in metrics and logs
- Uptime monitoring
- Performance insights

## 📊 Render Pricing

### Free Tier
- 750 hours/month (enough for small apps)
- 512MB RAM
- Shared CPU
- Automatic sleep after 15 minutes of inactivity

### Paid Plans
- Starting at $7/month
- Always-on (no sleep)
- More resources
- Custom domains
- Priority support

## 🛠️ Development Workflow

### 1. Local Development
```bash
npm run dev
```

### 2. Test Locally
```bash
npm run build
npm start
```

### 3. Deploy to Render
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **Environment Variables**
   - Double-check variable names (case-sensitive)
   - Ensure Firebase config is correct
   - Restart service after adding new variables

3. **Cold Starts**
   - Free tier apps sleep after 15 minutes
   - First request may be slow (30+ seconds)
   - Consider paid plan for production

### Getting Help

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
- [Status Page](https://status.render.com/)

## 🎯 Next Steps

1. **Deploy your app** following the steps above
2. **Test your deployment** at your Render URL
3. **Set up custom domain** (optional)
4. **Monitor performance** in Render dashboard
5. **Add PostgreSQL** if you need a database later

Your application is now ready for Render deployment! 🚀
