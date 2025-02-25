const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt");
const catchAsync = require("../helpers/catchAsync");
const { Location } = require('../models/locationdata');

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("places.place");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, dob } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or username already taken." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    let formattedDOB = null;
    if (dob) {
      const [day, month, year] = dob.split("-");
      formattedDOB = new Date(`${year}-${month}-${day}`);
    }
    const newUser = new User({
      fullName,
      username,
      email,
      dob: formattedDOB,
      ...req.body,
      password: hashedPassword,
    });

    await newUser.save();
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser };


const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All input fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      return res
        .status(403)
        .json({
          message: "Your account has been deactivated. Contact support.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id, user.email);

    res.status(200).json({
      message: "Successfully logged in",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const getFollowers = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate({
    path: "followers",
    select: "fullName username email profilePic", 
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    totalFollowers: user.followers.length,
    followers: user.followers,
  });
});


const getFollowing = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate({
    path: "following",
    select: "fullName username email profilePic", 
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json({
    totalFollowing: user.following.length,
    following: user.following,
  });
});




const addToWishlist = catchAsync(async (req, res) => {
  const { userId, placeId } = req.body;

  // Validate required fields
  if (!userId || !placeId) {
    return res.status(400).json({ success: false, message: 'userId and placeId are required' });
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Check if the place exists
  const place = await Location.findById(placeId);
  if (!place) {
    return res.status(404).json({ success: false, message: 'Place not found' });
  }

  // Check if the place is already in the wishlist
  const existingWishlistItem = user.places.find(
    (p) => p.place.toString() === placeId && p.wishlist === true
  );

  if (existingWishlistItem) {
    return res.status(400).json({ success: false, message: 'Place already in wishlist' });
  }

  // Add place to wishlist
  user.places.push({ place: placeId, wishlist: true });
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Place added to wishlist successfully',
    wishlist: user.places.filter((p) => p.wishlist === true),
  });
});



const removeFromWishlist = catchAsync(async (req, res) => {
  const { userId, placeId } = req.body;

  if (!userId || !placeId) {
    return res.status(400).json({ success: false, message: 'userId and placeId are required' });
  }

  // Find user
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  // Check if the place exists in the wishlist
  const wishlistItem = user.places.find(
    (p) => p.place.toString() === placeId && p.wishlist === true
  );

  if (!wishlistItem) {
    return res.status(400).json({ success: false, message: 'Place not found in wishlist' });
  }

  // Remove the place from the wishlist by filtering it out
  user.places = user.places.filter(
    (p) => !(p.place.toString() === placeId && p.wishlist === true)
  );

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Place removed from wishlist successfully',
    wishlist: user.places.filter((p) => p.wishlist === true),
  });
});




module.exports = { userLogin, getUsers, createUser, getFollowers, getFollowing, addToWishlist, removeFromWishlist };
