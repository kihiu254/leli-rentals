#!/usr/bin/env node

/**
 * Script to help create .env.local file for PostgreSQL configuration
 */

import fs from 'fs';
import path from 'path';

console.log('🔧 Creating .env.local file for PostgreSQL configuration...\n');

const envContent = `# Firebase Configuration (Replace with your actual Firebase values)
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
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3001/api/graphql`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local file already exists!');
    console.log('   Please backup your existing file and run this script again.');
    process.exit(1);
  }

  // Create .env.local file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ .env.local file created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Replace the Firebase placeholder values with your actual Firebase credentials');
  console.log('2. The PostgreSQL configuration is already set with your Neon database details');
  console.log('3. Restart your development server: npm run dev');
  console.log('4. Test the integration at: http://localhost:3001/test-integration');
  
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  process.exit(1);
}
