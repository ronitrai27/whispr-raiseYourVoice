const User = require("../models/User");
const mongoose = require("mongoose");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // Listen for follow events
    socket.on("follow", async ({ followerId, targetId }) => {
      // console.log(`➡️ ${followerId} followed ${targetId}`);

      try {
        const follower = await User.findById(followerId);
        const target = await User.findById(targetId);

        if (follower && target) {
          if (!target.followers.includes(followerId)) {
            target.followers.push(followerId);
            follower.followed.push(targetId);

            await target.save();
            await follower.save();

            // Emit update to all clients
            io.emit("update-follow", { followerId, targetId });
            console.log(`Database updated: ${followerId} followed ${targetId}`);
          }
        }
      } catch (err) {
        console.error("Error following user:", err);
      }
    });

    socket.on("unfollow", async ({ followerId, targetId }) => {
      // console.log(`⬅️ ${followerId} unfollowed ${targetId}`);

      try {
        const follower = await User.findById(followerId);
        const target = await User.findById(targetId);

        if (follower && target) {
          // Correct way to instantiate ObjectId
          const followerObjectId = new mongoose.Types.ObjectId(followerId);
          const targetObjectId = new mongoose.Types.ObjectId(targetId);
          target.followers = target.followers.filter(
            (id) => !id.equals(followerObjectId) // Use .equals() for ObjectId comparison
          );

          // Remove the target from the follower's followed array
          follower.followed = follower.followed.filter(
            (id) => !id.equals(targetObjectId)
          );

          if (
            target.isModified("followers") ||
            follower.isModified("followed")
          ) {
            await target.save();
            await follower.save();

            // Emit update to all clients
            io.emit("update-unfollow", { followerId, targetId });
            console.log(
              `Database updated: ${followerId} unfollowed ${targetId}`
            );
          } else {
            console.log("No changes to save for unfollow");
          }
        }
      } catch (err) {
        console.error("Error unfollowing user:", err);
      }
    });

    socket.on("disconnect", () => {
      // console.log(`🔴 Client closed follow/unfollow page:`);
    });
  });
};

// ---------------WORKING EXAMPLE------------------
// 1. This is setting up a listener for incoming socket connections. Each time a client connects to the server, a socket object is created for that client.

// 2. socket.on("follow", ...): This listens for a "follow" event sent from the client (e.g., when a user clicks the "follow" button). It expects an object with followerId and targetId (the IDs of the users involved).

// 3;User.findById(followerId) and User.findById(targetId): These queries retrieve the follower and target user documents from the database using their respective IDs.

//4.io.emit("update-follow", ...): Sends an event (update-follow) to all connected clients, notifying them that the follower has successfully followed the target.

// ANOTHER EVENT--------------
// socket.on("unfollow", ...): This listens for an "unfollow" event (e.g., when a user clicks the "unfollow" button). It expects an object with followerId and targetId.
