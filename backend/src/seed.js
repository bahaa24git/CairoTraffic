import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  await connectDB();

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminName = process.env.SEED_ADMIN_NAME || 'Cairo Traffic Admin';

  if (!adminEmail || !adminPassword) {
    throw new Error('Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running the seed script.');
  }

  await User.deleteOne({ email: adminEmail });

  await User.create({
    fullName: adminName,
    email: adminEmail,
    password: adminPassword,
    role: 'admin',
  });

  console.log(`Seeded admin user: ${adminEmail}`);
  process.exit(0);
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
