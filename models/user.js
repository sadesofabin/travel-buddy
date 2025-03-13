const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  type: { type: String, default: "user" },
  profilePic: { type: String, default: "https://yourwebsite.com/default-profile.jpg" },
  profileBanner: { type: String, default: "https://yourwebsite.com/default-banner.jpg" },
  bio: { type: String },
  phone: { type: String }, 
  city: { type: String },  
  profession: { type: String },
  hobbies: [{ type: String }],
  dob: { type: String }, 
  avatar: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  isDeleted: { type: Boolean, default: false },
}, 
{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
