const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
} = require("../controllers/commentController");
const { verifyAuthToken } = require("../middleware/authMiddleware");

// POST /api/comments--------------------------------
router.post("/create", verifyAuthToken, createComment);
//GET
router.get("/", verifyAuthToken, getComments);
module.exports = router;
