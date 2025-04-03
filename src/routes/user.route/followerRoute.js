const express = require("express");
const {
  toggleFollow,
  getFollowersOrFollowing
} = require("@controllers/user.controller/follower.controller");

const router = express.Router();

router.post("/toggleFollow/:userId", toggleFollow);
router.get("/get/:userId", getFollowersOrFollowing);


module.exports = router;
