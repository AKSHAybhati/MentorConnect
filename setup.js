#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up MentorConnect...\n');

// Function to run commands
const runCommand = (command, description) => {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    process.exit(1);
  }
};

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required');
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}\n`);

// Install root dependencies
runCommand('npm install', 'Installing root dependencies');

// Install server dependencies
runCommand('npm run install-server', 'Installing server dependencies');

// Install client dependencies
runCommand('npm run install-client', 'Installing client dependencies');

// Check if .env file exists
const envPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Creating .env file...');
  const envContent = `MONGODB_URI=mongodb://localhost:27017/mentorconnect
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created\n');
} else {
  console.log('✅ .env file already exists\n');
}

console.log('🎉 Setup completed successfully!\n');
console.log('📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the .env file in the server directory with your actual values');
console.log('3. Run "npm run dev" to start both client and server');
console.log('4. Open http://localhost:3000 in your browser\n');

console.log('🔧 Available commands:');
console.log('- npm run dev        : Start both client and server');
console.log('- npm run server     : Start only the server');
console.log('- npm run client     : Start only the client');
console.log('- npm run build      : Build the client for production\n');

console.log('📚 For more information, check the README.md file');
console.log('🐛 If you encounter issues, please check the troubleshooting section in README.md');