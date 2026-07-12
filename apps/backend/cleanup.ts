import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

import { User } from './src/modules/users/user.model';
import { hashPassword } from './src/utils';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hostelite';

async function runCleanup() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // 1. Delete all users where isEmailVerified = false
    const deleteResult = await User.deleteMany({ isEmailVerified: false });
    console.log(`Deleted ${deleteResult.deletedCount} unverified users.`);

    // 2. Recreate Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      await User.deleteOne({ email: adminEmail });
      console.log('Deleted existing admin account.');
    }

    const hashedPassword = await hashPassword(adminPassword);
    
    const adminUser = new User({
      name: 'System Admin',
      email: adminEmail,
      phone: '+1234567890',
      password: hashedPassword,
      role: 'ADMIN',
      isEmailVerified: true,
      isActive: true,
      isFirstLogin: false,
      username: 'admin',
    });

    await adminUser.save();
    console.log(`Admin account created successfully!
      Email: ${adminEmail}
      Password: [HIDDEN FOR SECURITY]
    `);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runCleanup();
