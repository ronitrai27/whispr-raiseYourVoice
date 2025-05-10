const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  getMyUser,
  getFollowingProfiles,
} = require("../controllers/userController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
router.get("/call/myself", verifyAuthToken, getMyUser);
router.get("/:username", getUserProfile);
router.get("/call/following-profiles", verifyAuthToken, getFollowingProfiles);

module.exports = router;
