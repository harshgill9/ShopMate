// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
    // unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  otpHash: { 
    type: String,
    //  default: undefined, 
     select: false,
  },
  otpExpiresAt: { 
    type: Date, 
    // default: undefined, 
    select: false
  },
  date: {
    type: Date,
    default: Date.now,
  },

  shippingAddress: {
    fullName: { type: String },
    phone: { type: String },
    house: { type: String },
    road: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    nearby: { type: String }
  },
});

const User = mongoose.model("User", UserSchema);

export default User;  // ✅ ESM default export
