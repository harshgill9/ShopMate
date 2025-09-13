// scripts/createUser.js

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config({ path: 'C:/Users/A/OneDrive/Desktop/shopping/backend/.env' });

const createNewUser = async (username, password, role) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for user creation...');

    const userExists = await User.findOne({ username });

    if (userExists) {
      console.log(`User with username '${username}' already exists.`);
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    console.log(`User '${newUser.username}' created successfully with role '${newUser.role}'!`);
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating user:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Command line args
const args = process.argv.slice(2);

if (args.length !== 3) {
  console.log('Usage: node scripts/createUser.js <username> <password> <role (user/admin)>');
  process.exit(1);
}

const [username, password, role] = args;

if (!['user', 'admin'].includes(role)) {
  console.log('Invalid role. Role must be "user" or "admin".');
  process.exit(1);
}

createNewUser(username, password, role);
