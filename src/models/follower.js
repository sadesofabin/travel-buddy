const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: { type: Boolean, default: false },
      },
    ],
    following: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        status: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

const Follower = mongoose.model("Follower", FollowerSchema);

module.exports = Follower;
