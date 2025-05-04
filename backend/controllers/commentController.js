const Comment = require("../models/comment");

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { text, topics, isPublic } = req.body;
    const userId = req.user._id;

    if (!text || !userId) {
      return res.status(400).json({ message: "Unauthorized" });
    }

    // Create new comment
    const newComment = await Comment.create({
      text: text.trim(),
      topics: topics || [],
      public: isPublic ?? true,
      user: userId,
    });

    return res
      .status(201)
      .json({ message: "Comment posted successfully!", comment: newComment });
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

// GET COMMENTS--------------------------------------------------------
const getComments = async (req, res) => {
  try {
    const { filter = "ALL", page = 1 } = req.query;
    const limit = 6;
    const skip = (page - 1) * limit;

    let commentsQuery;

    if (filter === "ALL") {
      commentsQuery = {}; // No filter, get all
    } else if (filter === "FOLLOWING") {
      const currentUser = await User.findById(req.user._id);
      const followingList = currentUser.followed; // IDs of followed users
      commentsQuery = { userId: { $in: followingList } };
    } else if (filter === "TRENDING") {
      // Later we'll sort by likes/replies
      commentsQuery = {}; // Same as ALL, but sort differently
    } else {
      return res.status(400).json({ message: "Invalid filter." });
    }

    let query = Comment.find(commentsQuery);

    // For trending, sort by most likes/replies
    if (filter === "TRENDING") {
      query = query.sort({ likes: -1, repliesCount: -1 });
    } else {
      query = query.sort({ createdAt: -1 }); // Newest first for ALL / FOLLOWING
    }

    const comments = await query.skip(skip).limit(limit);

    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createComment, getComments };
