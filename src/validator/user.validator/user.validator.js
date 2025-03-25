const { z } = require("zod");

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// User Creation Validator
const createUserValidator = z.object({
  body: z.object({
    fullName: z.string({ required_error: "Full name is required" }).min(3, "Full name must be at least 3 characters"),
    username: z.string({ required_error: "Username is required" }).min(3, "Username must be at least 3 characters"),
    password: z.string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password cannot exceed 50 characters"),
    email: z.string({ required_error: "Email is required" }).email("Invalid email format"),
    type: z.enum(["user", "admin"]).optional().default("user"),
    profilePic: z.string().url("Invalid profile picture URL").optional(),
    profileBanner: z.string().url("Invalid banner URL").optional(),
    bio: z.string().max(500, "Bio must be under 500 characters").optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
    city: z.string().optional(),
    profession: z.string().optional(),
    hobbies: z.array(z.string()).optional(),
    dob: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date of birth must be in DD-MM-YYYY format").optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    isDeleted: z.boolean().optional().default(false),
  }),
});

// User ID Validator for params
const userIdValidator = z.object({
  params: z.object({
    userId: z.string().regex(objectIdRegex, "Invalid user ID"),
  }),
});

module.exports = {
  createUserValidator,
  userIdValidator,
};
