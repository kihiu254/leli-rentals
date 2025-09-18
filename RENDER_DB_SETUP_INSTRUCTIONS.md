# Render Database Setup Instructions

## Step 1: Create Render PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `lelirentals-db`
   - **Database**: `lelirentals`
   - **User**: `lelirentals_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier (0.5GB) or paid for production

## Step 2: Get Your Database Credentials

After creating the database, you'll see connection details like:
```
Host: dpg-xxxxx-a.oregon-postgres.render.com
Database: lelirentals
User: lelirentals_user
Password: xxxxx
Port: 5432
```

## Step 3: Update Your .env.local File

Add these variables to your `.env.local` file (replace with your actual credentials):

```bash
# Render Database Configuration
RENDER_DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
RENDER_DB_NAME=lelirentals
RENDER_DB_USER=lelirentals_user
RENDER_DB_PASSWORD=your-actual-password-here
RENDER_DB_PORT=5432

# Alternative naming (if needed)
POSTGRES_HOST=dpg-xxxxx-a.oregon-postgres.render.com
POSTGRES_DB=lelirentals
POSTGRES_USER=lelirentals_user
POSTGRES_PASSWORD=your-actual-password-here
POSTGRES_PORT=5432
```

## Step 4: Initialize Database Schema

Run the database initialization script:

```bash
node scripts/init-database.js
```

This will create all the necessary tables and insert sample data.

## Step 5: Test the Connection

The application will now use PostgreSQL for:
- ✅ **Messaging system** (real-time chat)
- ✅ **Bookings management** (persistent storage)
- ✅ **User interactions** (likes, saves, views)
- ✅ **Notifications** (user alerts)

## Troubleshooting

### If you get "Module not found: Can't resolve 'pg'" error:
1. Make sure you've installed the dependencies: `npm install pg @types/pg`
2. The database utilities are designed to work server-side only
3. Client-side components will continue to use Firebase

### If database connection fails:
1. Check your environment variables are correct
2. Ensure your Render database is running
3. Verify the connection string format

### For production deployment:
1. Set the same environment variables in your Render web service
2. Make sure SSL is enabled for production connections
3. Consider upgrading to a paid database plan for better performance

## Example .env.local File

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# Render Database Configuration
RENDER_DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
RENDER_DB_NAME=lelirentals
RENDER_DB_USER=lelirentals_user
RENDER_DB_PASSWORD=your-actual-password-here
RENDER_DB_PORT=5432

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Next.js Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
