const User = require("../models/User");

exports.getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id; // from verifyAuthToken

    // Fetch the current user's document to get their followed array
    const currentUser = await User.findById(currentUserId).select("followed");
    const followedIds = currentUser.followed || []; // Default to empty array if followed is undefined

    const randomUsers = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: [currentUserId, ...followedIds], // Exclude current user and followed users
          },
        },
      },
      { $sample: { size: 5 } },
      { $project: { _id: 1, username: 1, publicId: 1, profilePic: 1 } },
    ]);

    // console.log(
    //   `✅ [getSuggestedUsers] Random users fetched (count: ${randomUsers.length}):`
    // );

    res.status(200).json({ success: true, users: randomUsers });
    console.log("DISCOVER USER SENT TO CLIENT");
  } catch (error) {
    console.error(
      "❌ [getSuggestedUsers] Error fetching suggested users:",
      error.message
    );
    res.status(500).json({ success: false, message: "Server error" });
  }
};
