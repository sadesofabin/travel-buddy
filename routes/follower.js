const express = require("express");
const { toggleFollow  } = require("../controllers/followerController");

const router = express.Router();


router.post('/follow/:userId', toggleFollow);


module.exports = router;
