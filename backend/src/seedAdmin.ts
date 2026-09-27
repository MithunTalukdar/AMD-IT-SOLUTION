import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/User.js';
import { hashPassword } from './utils/hash.js';

async function seedAdmin() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/amd_it_solution';
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!');

  const adminEmail = 'admin@amditsolution.in';
  const adminPassword = 'Admin@123456';
  const hashed = await hashPassword(adminPassword);

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    existing.password = hashed;
    existing.role = 'admin';
    existing.fullname = 'AMD Admin';
    existing.isActive = true;
    await existing.save();
    console.log(`✓ Admin user ${adminEmail} updated successfully!`);
  } else {
    await User.create({
      fullname: 'AMD Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      phone: '9635006403',
      isActive: true,
    });
    console.log(`✓ Admin user ${adminEmail} created successfully!`);
  }

  // Also create a default technician account for testing if needed
  const techEmail = 'technician@amditsolution.in';
  const techPassword = 'Tech@123456';
  const techHashed = await hashPassword(techPassword);
  const existingTech = await User.findOne({ email: techEmail });
  if (existingTech) {
    existingTech.password = techHashed;
    existingTech.role = 'technician';
    existingTech.fullname = 'Senior Technician';
    existingTech.isActive = true;
    await existingTech.save();
    console.log(`✓ Technician user ${techEmail} updated!`);
  } else {
    await User.create({
      fullname: 'Senior Technician',
      email: techEmail,
      password: techHashed,
      role: 'technician',
      phone: '9635006403',
      isActive: true,
    });
    console.log(`✓ Technician user ${techEmail} created!`);
  }

  console.log('\n=======================================');
  console.log('🔑 ADMIN LOGIN CREDENTIALS:');
  console.log('   Email:    admin@amditsolution.in');
  console.log('   Password: Admin@123456');
  console.log('   Role:     admin');
  console.log('---------------------------------------');
  console.log('🔑 TECHNICIAN LOGIN CREDENTIALS:');
  console.log('   Email:    technician@amditsolution.in');
  console.log('   Password: Tech@123456');
  console.log('   Role:     technician');
  console.log('=======================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('Seed Admin error:', err);
  process.exit(1);
});
