require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();

    const email = process.env.SEED_ADMIN_EMAIL || 'admin@grams.local';
    const password = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    let user = await User.findOne({ email });
    if (user) {
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
      }
      console.log(`Admin user already exists: ${email}`);
      process.exit(0);
    }

    user = new User({
      name: 'System Admin',
      email,
      password,
      role: 'admin',
    });

    await user.save();
    console.log('Admin user created successfully:', email);
    console.log('Password:', password);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
})();
