const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/jwt");
const catchAsync = require("../helpers/catchAsync");
const { Location } = require("../models/locationdata");

// Get All Users
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;

    const skip = (page - 1) * limit;

    const users = await User.find().select("-password").skip(skip).limit(limit);

    const totalUsers = await User.countDocuments();

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      currentPage: page,
      totalPages,
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create User
const createUser = async (req, res) => {
  try {
    const { fullName, username, email, password, dob, gender } = req.body;
    if (!fullName || !username || !email || !password || !gender) {
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
      return res.status(403).json({
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

// Update User

const cleanObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  });
  return obj;
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    let { dob } = req.body;

    // Format DOB if provided
    if (dob) {
      const [day, month, year] = dob.split("-");
      dob = new Date(`${year}-${month}-${day}`);
    }

    const data = cleanObject(req.body);

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userLogin,
  getUsers,
  createUser,
  getFollowers,
  getFollowing,
  getUserById,
  updateUser,
};
