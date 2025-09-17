# 🚀 Firebase + PostgreSQL + GraphQL Setup Guide

This guide will help you set up your Leli Rentals marketplace with Firebase Authentication, PostgreSQL database, and GraphQL API.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   GraphQL API   │    │   PostgreSQL    │
│   (Next.js)     │◄──►│   (Apollo)      │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • React         │    │ • Queries       │    │ • Users         │
│ • Apollo Client │    │ • Mutations     │    │ • Listings      │
│ • Firebase Auth │    │ • Subscriptions │    │ • Bookings      │
└─────────────────┘    └─────────────────┘    │ • Reviews       │
         │                                      └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Firebase      │
│   Authentication│
│                 │
│ • Email/Password│
│ • Google OAuth  │
│ • Token Auth    │
└─────────────────┘
```

## 🛠️ **Step-by-Step Setup**

### **Step 1: Install PostgreSQL**

#### **Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Make sure PostgreSQL service is running

#### **macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb lelirentals
```

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb lelirentals
```

### **Step 2: Create Database Schema**

1. **Connect to PostgreSQL:**
```bash
psql -U postgres -d lelirentals
```

2. **Run the schema:**
Copy and paste the contents of `database/schema.sql` into your PostgreSQL client.

3. **Verify tables were created:**
```sql
\dt
```

You should see tables: `users`, `listings`, `bookings`, `reviews`, `categories`, etc.

### **Step 3: Configure Environment Variables**

Add these to your `.env.local` file:

```env
# Firebase Configuration (Keep existing)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=lelirentals
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password

# GraphQL Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql
```

### **Step 4: Install Dependencies**

```bash
npm install graphql @apollo/client @apollo/server apollo-server-express graphql-tag pg @types/pg
```

### **Step 5: Test the Integration**

1. **Start your development server:**
```bash
npm run dev
```

2. **Visit the test page:**
Go to `http://localhost:3000/test-integration`

3. **Run the tests:**
- ✅ Firebase Authentication should work
- ✅ GraphQL API should respond
- ✅ PostgreSQL database should be connected
- ✅ Mutations should work

## 🔧 **Configuration Files**

### **Database Connection** (`lib/postgres.ts`)
```typescript
const poolConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'lelirentals',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
}
```

### **GraphQL Schema** (`lib/graphql/schema.ts`)
- Complete schema with all types, queries, and mutations
- Firebase UID integration for user management
- Proper relationships between entities

### **GraphQL Resolvers** (`lib/graphql/resolvers.ts`)
- Firebase token verification
- PostgreSQL database operations
- User authentication and authorization
- CRUD operations for all entities

## 🚀 **Usage Examples**

### **Query Listings:**
```typescript
import { useQuery } from '@apollo/client'
import { GET_LISTINGS } from '@/lib/graphql-client'

function ListingsPage() {
  const { data, loading, error } = useQuery(GET_LISTINGS, {
    variables: { 
      filters: { category: 'vehicles' },
      limit: 20 
    }
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data.listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>${listing.price}/day</p>
        </div>
      ))}
    </div>
  )
}
```

### **Create a Listing:**
```typescript
import { useMutation } from '@apollo/client'
import { CREATE_LISTING } from '@/lib/graphql-client'

function CreateListingForm() {
  const [createListing] = useMutation(CREATE_LISTING)

  const handleSubmit = async (formData) => {
    try {
      await createListing({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            price: formData.price,
            location: formData.location
          }
        }
      })
      // Success!
    } catch (error) {
      console.error('Error creating listing:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

### **Get Current User:**
```typescript
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql-client'

function ProfilePage() {
  const { data, loading } = useQuery(GET_ME)

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {data.me.name}!</h1>
      <p>Email: {data.me.email}</p>
      <p>Role: {data.me.role}</p>
    </div>
  )
}
```

## 🔐 **Authentication Flow**

1. **User signs in with Firebase** (email/password or Google)
2. **Frontend gets Firebase token**
3. **Apollo Client adds token to GraphQL requests**
4. **GraphQL resolvers verify Firebase token**
5. **User data is synced between Firebase and PostgreSQL**

## 📊 **Database Schema**

### **Key Tables:**
- `users` - User profiles (linked to Firebase UID)
- `listings` - Rental listings
- `bookings` - Booking transactions
- `reviews` - User reviews
- `categories` - Listing categories
- `favorites` - User favorites
- `messages` - User messages
- `notifications` - User notifications

### **Relationships:**
- Users can have multiple listings
- Listings can have multiple bookings
- Users can have multiple reviews
- Proper foreign key constraints

## 🚨 **Troubleshooting**

### **Database Connection Issues:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l

# Test connection
psql -U postgres -d lelirentals -c "SELECT version();"
```

### **GraphQL Errors:**
- Check Apollo Client configuration
- Verify Firebase token is being sent
- Check GraphQL endpoint URL

### **Authentication Issues:**
- Verify Firebase configuration
- Check if user is properly authenticated
- Ensure Firebase token is valid

## 🎯 **Next Steps**

1. **Set up your PostgreSQL database**
2. **Configure environment variables**
3. **Test the integration**
4. **Start building your rental marketplace features**

## 📚 **Resources**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Apollo GraphQL Documentation](https://www.apollographql.com/docs/)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

---

**Happy coding! 🚀** Your rental marketplace now has a powerful backend with Firebase auth, PostgreSQL database, and GraphQL API!
