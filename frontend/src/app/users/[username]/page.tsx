"use client";

import React, { useEffect, useState, use } from "react";
import api from "@/lib/api";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import FollowButton from "@/components/FollowButton";
import useSocket from "@/lib/useSocket";

interface UserProfile {
  _id: string;
  username: string;
  publicId: string;
  profilePic: string;
  followers: string[];
  followed: string[];
  totalComments: number;
  createdAt: string;
}

export default function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { user, darkMode } = useAppContext(); // Current user info
  const { username } = use(params); // Target username from URL
  const { socket } = useSocket(); // Get socket instance from custom hook
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user data from API
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/users/${username}`);
      setUserData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch user data when the component mounts or when the username changes
    fetchUserData();
  }, [username]);

  // Listen for follow/unfollow socket events
  useEffect(() => {
    if (socket) {
      const handleFollow = ({ followerId, targetId }) => {
        setUserData((prevState) => {
          if (prevState && prevState._id === targetId) {
            // Avoid duplicate followers
            if (!prevState.followers.includes(followerId)) {
              return {
                ...prevState,
                followers: [...prevState.followers, followerId],
              };
            }
          }
          return prevState;
        });
      };

      const handleUnfollow = ({ followerId, targetId }) => {
        setUserData((prevState) => {
          if (prevState && prevState._id === targetId) {
            return {
              ...prevState,
              followers: prevState.followers.filter(
                (follower) => follower !== followerId
              ),
            };
          }
          return prevState;
        });
      };

      socket.on("update-follow", handleFollow);
      socket.on("update-unfollow", handleUnfollow);

      return () => {
        socket.off("update-follow", handleFollow);
        socket.off("update-unfollow", handleUnfollow);
      };
    }
  }, [socket, username]);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {loading || !userData ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
          <div className="h-10 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-60 bg-gray-300 rounded"></div>
          <div className="h-3 w-40 bg-gray-300 rounded"></div>
        </div>
      ) : (
        <>
          <h1 className="text-red-500">id: {userData._id}</h1>
          <h1 className="text-xl font-bold">User: {userData.username}</h1>
          <p className="mt-2 text-gray-600">{userData.publicId}</p>
          <Image
            src={userData.profilePic}
            alt={userData.username}
            width={96}
            height={96}
            className="mt-4 rounded-full border border-gray-300 object-cover"
          />

          {user && user._id ? (
            <FollowButton currentUserId={user._id} targetUser={userData} />
          ) : (
            <p>Loading user data...</p> // Or handle the loading state however you want
          )}

          <p className="mt-4 text-sm text-gray-500">
            Total Comments: {userData.totalComments} | Followers:{" "}
            {userData.followers.length} | Following: {userData.followed.length}
          </p>
          <p className="text-xs text-gray-400">
            Joined on {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </>
      )}
    </div>
  );
}

// WORKING EXAMPLE-------------------_--------------------
// 1. This component receives params, which contain the username from the URL. The username is then used to fetch data for that specific user.

// 2. socket: The socket instance (from the useSocket hook) that enables real-time communication.
