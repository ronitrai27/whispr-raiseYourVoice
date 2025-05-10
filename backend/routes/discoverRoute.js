const express = require("express");
const router = express.Router();
const discoverController = require("../controllers/discoverController");
const { verifyAuthToken } = require("../middleware/authMiddleware");

// GET /api/discover
router.get("/people", verifyAuthToken, discoverController.getSuggestedUsers);

module.exports = router;
