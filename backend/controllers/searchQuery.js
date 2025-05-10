// controllers/searchController.js
const dbConnect = require("../config/db");
const User = require("../models/User");
const Fuse = require("fuse.js");

const searchController = async (req, res) => {
  //   await dbConnect();
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const regex = new RegExp(`^${query}`, "i");

    // Get top (exact or prefix) matches
    const exactMatches = await User.find({
      $or: [{ username: regex }, { publicId: regex }],
    })
      .select("username publicId profilePic")
      .limit(10)
      .lean();

    const exactIds = exactMatches.map((u) => u._id.toString());

    // Get fuzzy suggestions but exclude exact matches
    const allUsers = await User.find()
      .select("username publicId profilePic")
      .lean();

    const fuse = new Fuse(allUsers, {
      keys: ["username", "publicId"],
      threshold: 0.4,
      includeScore: true,
    });

    const fuzzyResults = fuse
      .search(query)
      .filter((r) => !exactIds.includes(r.item._id.toString())) // exclude exact matches
      .slice(0, 5)
      .map((r) => r.item);

    res.status(200).json({ exactMatches, suggestions: fuzzyResults });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { searchController };
