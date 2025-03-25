const express = require("express");
const {
  toggleFollow,
  getFollowersOrFollowing,
} = require("../controllers/followerController");

const router = express.Router();

router.post("/follow/:userId", toggleFollow);
router.get("/follow/:userId/getFollowers", getFollowersOrFollowing);

module.exports = router;
