// routes/search.js
const express = require("express");
const { searchController } = require("../controllers/searchQuery");

const router = express.Router();

router.get("/search-bar", searchController);

module.exports = router;
