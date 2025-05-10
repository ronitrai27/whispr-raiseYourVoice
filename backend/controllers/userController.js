const User = require("../models/User");

// FOR GETTING THE VISITED USER PROFILE DATA
const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch directly from MongoDB (no Redis cache)
    const user = await User.findOne({ username }).select(
      "_id username publicId profilePic followers followed totalComments createdAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = user.toObject();

    // console.log(`🟢 Serving user ${username} directly from MongoDB`);
    res.json(userData);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT LOGGED USER DATA.
const getMyUser = async (req, res) => {
  try {
    console.log("🟡 Incoming request to /call/myself");

    if (!req.user) {
      // console.error("🔴 req.user is missing! Check auth middleware.");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    // console.log("🟢 Extracted userId from token:", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      // console.error("🔴 No user found in DB for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // console.log("✅ Found user in DB:", user.username);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("🔥 Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getFollowingProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: "followed",
        select: "_id username publicId profilePic",
      })
      .lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      followedProfiles: user.followed,
    });
  } catch (err) {
    console.error("Error fetching following profiles", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getUserProfile,
  getMyUser,
  getFollowingProfiles,
};

//  ---------------CACHED INTO REDIS ----------------------------------------
// const User = require("../models/User");
// const redisClient = require("../config/redisClient");

// exports.getUserProfile = async (req, res) => {
//   const { username } = req.params;
//   const redisKey = `user:${username}`;

//   try {
//     const cachedUser = await redisClient.get(redisKey);
//     if (cachedUser) {
//       console.log(`🔴 Serving user ${username} from Redis`);
//       return res.json(JSON.parse(cachedUser));
//     }

//     // 2️⃣ Fetch from MongoDB if not in cache
//     const user = await User.findOne({ username }).select(
//       "_id username publicId profilePic followers followed totalComments createdAt"
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const userData = user.toObject();

//     // 3️⃣ Store in Redis with expiry (e.g., 1 hour)
//     await redisClient.set(redisKey, JSON.stringify(userData), "EX", 60 * 60);

//     console.log(`🟢 Serving user ${username} from MongoDB & caching in Redis`);
//     console.log(userData);
//     res.json(userData);
//   } catch (err) {
//     console.error("Error in getUserProfile:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
