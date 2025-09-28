// backend/createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import dotenv from "dotenv";
import User from "./models/User.js"; // adjust path if your User model is elsewhere

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function main() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGO_URI not found in .env. Set MONGO_URI in backend/.env");
      process.exit(1);
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    const username = (await question("Enter admin username: ")).trim();
    const email = (await question("Enter admin email: ")).trim();
    const password = (await question("Enter admin password: ")).trim();

    if (!username || !email || !password) {
      console.error("❌ username, email and password are required");
      process.exit(1);
    }

    const existing = await User.findOne({ username });

    if (existing) {
      const ans = (await question(`User "${username}" already exists. Overwrite? (y/N): `)).trim().toLowerCase();
      if (ans !== "y" && ans !== "yes") {
        console.log("Aborting. No changes made.");
        process.exit(0);
      }
      await User.deleteMany({ username });
      console.log("Existing user(s) removed.");
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "Admin User",
      username,
      email,
      phoneNumber: "0000000000",
      password: hashed,
      role: "admin",
    });

    await admin.save();
    console.log(`✅ Admin user created: username="${username}", email="${email}"`);
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    rl.close();
    process.exit(1);
  }
}

main();
