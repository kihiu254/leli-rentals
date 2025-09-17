# 🔧 PostgreSQL .env.local Configuration Guide

## Step-by-Step Setup

### 1. Create .env.local File

Create a new file named `.env.local` in your project root directory (same level as `package.json`).

### 2. Copy This Configuration

Copy and paste this exact content into your `.env.local` file:

```env
# Firebase Configuration (Keep your existing Firebase values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# PostgreSQL Configuration (Your Neon Database)
POSTGRES_HOST=ep-long-paper-adi261yc-pooler.c-2.us-east-1.aws.neon.tech
POSTGRES_PORT=5432
POSTGRES_DB=neondb
POSTGRES_USER=neondb_owner
POSTGRES_PASSWORD=npg_uNQnixs7Yf2a

# GraphQL Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3001/api/graphql
```

### 3. Replace Firebase Values

Replace the Firebase placeholder values with your actual Firebase configuration:
- `your_firebase_api_key_here` → Your actual Firebase API key
- `your_firebase_auth_domain_here` → Your actual Firebase auth domain
- `your_firebase_project_id_here` → Your actual Firebase project ID
- etc.

### 4. Save the File

Save the `.env.local` file in your project root.

## Your Neon Database Details

From your Neon dashboard, these are the exact values to use:

- **Host:** `ep-long-paper-adi261yc-pooler.c-2.us-east-1.aws.neon.tech`
- **Port:** `5432`
- **Database:** `neondb`
- **Username:** `neondb_owner`
- **Password:** `npg_uNQnixs7Yf2a`

## File Structure

Your project should look like this:
```
your-project/
├── .env.local          ← Create this file here
├── package.json
├── next.config.mjs
├── database/
│   └── schema.sql
└── ...
```

## Test Configuration

After creating the `.env.local` file:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3001/test-integration

3. Check if the database connection test passes

## Troubleshooting

- Make sure `.env.local` is in the project root (same level as `package.json`)
- Ensure there are no extra spaces or quotes around the values
- Restart the development server after creating the file
- Check that the file is named exactly `.env.local` (not `.env.local.txt`)
