#!/usr/bin/env node

/**
 * Database Setup Script for Leli Rentals
 * This script helps you set up PostgreSQL and test the integration
 */

import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Leli Rentals Database Setup Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# Firebase Configuration (Keep your existing values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here

# PostgreSQL Configuration (Neon Cloud Database)
# Replace with your Neon connection details
POSTGRES_HOST=your_neon_host_here
POSTGRES_PORT=5432
POSTGRES_DB=lelirentals
POSTGRES_USER=your_neon_username_here
POSTGRES_PASSWORD=your_neon_password_here

# GraphQL Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:3000/api/graphql`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created!');
} else {
  console.log('✅ .env.local file already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('======================');
console.log('1. Go to https://neon.tech/ and sign up');
console.log('2. Create a new project named "lelirentals"');
console.log('3. Copy your connection string from Neon dashboard');
console.log('4. Update your .env.local file with the connection details');
console.log('5. Run this script again to test the connection');

// Function to test database connection
async function testConnection() {
  try {
    // Load environment variables
    const { config } = await import('dotenv');
    config({ path: envPath });
    
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: { rejectUnauthorized: false }
    });

    console.log('\n🔌 Testing database connection...');
    await client.connect();
    console.log('✅ Database connection successful!');

    // Check if schema exists
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Database schema already exists!');
    } else {
      console.log('⚠️  Database schema not found. You need to run the schema.');
      console.log('\n📝 To set up the schema:');
      console.log('1. Open Neon dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the contents of database/schema.sql');
      console.log('4. Execute the SQL');
    }

    await client.end();
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:');
    console.log('   Error:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('   1. Created a Neon account and project');
    console.log('   2. Updated .env.local with correct credentials');
    console.log('   3. Run the database schema');
    return false;
  }
}

// Run the test if environment variables are set
if (process.argv.includes('--test')) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
} else {
  console.log('\n💡 To test the connection, run: node setup-database.js --test');
}
