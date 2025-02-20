const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  
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
  
  places: [
    {
      place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
      visited: { type: Boolean, default: false },
      wishlist: { type: Boolean, default: false }
    }
  ],
  
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
  isDeleted: { type: Boolean, default: false },
}, 
{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
