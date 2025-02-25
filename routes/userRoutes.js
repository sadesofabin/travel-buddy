const express = require("express");
const { getUsers, createUser, userLogin, getFollowers, getFollowing, addToWishlist, removeFromWishlist } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.post("/createUser", createUser);
router.post("/login", userLogin);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);
router.post('/wishlist/add', addToWishlist);
router.post('/wishlist/remove', removeFromWishlist);


module.exports = router;
