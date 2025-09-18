# Render Database Setup Guide

This guide will help you connect your Leli Rentals application to Render's PostgreSQL database for messaging and bookings functionality.

## 1. Create Render PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure your database:
   - **Name**: `lelirentals-db`
   - **Database**: `lelirentals`
   - **User**: `lelirentals_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free tier (0.5GB) or paid for production

## 2. Get Database Connection Details

After creating the database, you'll get connection details like:
```
Host: dpg-xxxxx-a.oregon-postgres.render.com
Database: lelirentals
User: lelirentals_user
Password: xxxxx
Port: 5432
```

## 3. Set Environment Variables

In your Render web service environment variables, add:

```bash
# Database Connection
RENDER_DB_HOST=dpg-d3612q1r0fns73bhopo0-a
RENDER_DB_NAME=lelirentals
RENDER_DB_USER=lelirentals_user
RENDER_DB_PASSWORD=i2vAf2EJ68fEhhroqZweQ67IhpI5fJbe
RENDER_DB_PORT=5432

# Alternative naming (if needed)
POSTGRES_HOST=doregon-postgres.render.compg-xxxxx-a.
POSTGRES_DB=lelirentals
POSTGRES_USER=lelirentals_user
POSTGRES_PASSWORD=your-password-here
POSTGRES_PORT=5432

# Keep existing Firebase and Paystack variables
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Production settings
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
```

## 4. Install PostgreSQL Dependencies

Add to your `package.json`:

```bash
npm install pg @types/pg
```

## 5. Initialize Database Schema

Run the database initialization script:

```bash
# Set environment variables locally first
export RENDER_DB_HOST=your-host
export RENDER_DB_NAME=your-db-name
export RENDER_DB_USER=your-user
export RENDER_DB_PASSWORD=your-password
export RENDER_DB_PORT=5432

# Run initialization
node scripts/init-database.js
```

## 6. Update Your Application

Replace Firebase services with PostgreSQL versions:

### In your components/pages:

```typescript
// Replace this:
import { bookingsService } from "@/lib/bookings-service"

// With this:
import { bookingsService } from "@/lib/bookings-service-postgres"
```

### In your messaging page:

```typescript
// Replace this:
import { messagingService } from "@/lib/messaging-service"

// The messaging service is already updated for PostgreSQL
```

## 7. Database Schema Overview

The database includes these main tables:

- **users**: User profiles and authentication
- **listings**: Rental listings
- **bookings**: Booking records
- **chat_sessions**: Chat conversations
- **messages**: Individual messages
- **notifications**: User notifications
- **user_interactions**: Likes, saves, views
- **reviews**: User reviews
- **saved_bookings**: Wishlist items

## 8. Features Enabled

With PostgreSQL integration, you get:

✅ **Real-time messaging** between users and owners
✅ **Persistent booking history** with full details
✅ **User notifications** for bookings and messages
✅ **Search functionality** across messages and bookings
✅ **Data relationships** with foreign keys and constraints
✅ **Transaction support** for data consistency
✅ **Scalable architecture** for production use

## 9. Testing the Integration

1. Deploy your updated application to Render
2. Test creating a booking
3. Test sending messages between users
4. Verify data persistence across page refreshes
5. Check that notifications are working

## 10. Monitoring and Maintenance

- Monitor database performance in Render dashboard
- Set up database backups (automatic on paid plans)
- Monitor connection pool usage
- Set up alerts for database issues

## Troubleshooting

### Connection Issues
- Verify environment variables are set correctly
- Check that your Render web service can access the database
- Ensure SSL is enabled for production connections

### Schema Issues
- Run the initialization script again if tables are missing
- Check for any SQL syntax errors in the schema
- Verify user permissions on the database

### Performance Issues
- Monitor query performance
- Add indexes for frequently queried fields
- Consider upgrading to a paid database plan for better performance

## Support

For issues with:
- **Render Database**: Check Render documentation
- **PostgreSQL**: Check PostgreSQL documentation
- **Application Integration**: Check the application logs in Render dashboard
