import React, { useState } from "react";
import useSocket from "@/lib/useSocket"; // Custom hook for managing socket connection

interface FollowButtonProps {
  currentUserId: string; // Current user's ID
  targetUser: { _id: string; followers: string[] }; // Simplified target user data
}

const FollowButton: React.FC<FollowButtonProps> = ({
  currentUserId,
  targetUser,
}) => {
  const { socket } = useSocket(); // Access socket from the custom hook
  const [isFollowing, setIsFollowing] = useState<boolean>(
    targetUser.followers.includes(currentUserId) // Check if the current user is following
  );

  const handleFollow = () => {
    // Emit the follow event to the backend
    socket.emit("follow", {
      followerId: currentUserId,
      targetId: targetUser._id,
    });
    setIsFollowing(true); // Update the button state to unfollow
  };

  const handleUnfollow = () => {
    // Emit the unfollow event to the backend
    socket.emit("unfollow", {
      followerId: currentUserId,
      targetId: targetUser._id,
    });
    setIsFollowing(false);
  };

  return (
    <button
      onClick={isFollowing ? handleUnfollow : handleFollow}
      className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;

// 1.  .emit() is a method used to send an event/message from the client to the server or vice versa. It is used for real-time communication in WebSocket-based applications, enabling two-way communication between the client and the server.

// 2. When you use .emit(), the client sends an event to the server, and the server can then listen for that event using .on().

// 3. When the "Follow" button is clicked, this function emits a "follow" event to the server.
