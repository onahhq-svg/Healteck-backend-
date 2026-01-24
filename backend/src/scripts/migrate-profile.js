// scripts/migrate-profiles.js
import mongoose from 'mongoose';
import { ROLES } from '../src/constants/roles.js';
import Profile from '../src/modules/profile/profile.model.js';
import User from '../src/modules/user/user.model.js';
import { connectDB } from '../src/config/database.js';

async function migrateProfiles() {
  try {
    await connectDB();
    
    // Get all users who don't have a profile
    const users = await User.find({});
    
    let created = 0;
    let skipped = 0;
    
    for (const user of users) {
      const existingProfile = await Profile.findOne({ userId: user._id });
      
      if (!existingProfile) {
        await Profile.create({
          userId: user._id,
          activeRole: user.role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER,
          roles: user.role === ROLES.ADMIN 
            ? [{ name: ROLES.ADMIN, status: 'APPROVED' }] 
            : []
        });
        created++;
      } else {
        skipped++;
      }
    }
    
    console.log(`Migration complete. Created ${created} profiles, skipped ${skipped} existing profiles.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProfiles();