import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteOne({ email: 'admin@cairotraffic.com' });

  await User.create({
    fullName: 'Cairo Traffic Admin',
    email: 'admin@cairotraffic.com',
    password: 'Admin12345',
    role: 'admin',
  });

  console.log('Seeded admin user: admin@cairotraffic.com / Admin12345');
  process.exit(0);
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
