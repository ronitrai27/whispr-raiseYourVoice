"use client";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import {
  Star,
  User,
  Heart,
  Users,
  Bookmark,
  MessageSquare,
  Paperclip,
  VenusAndMars,
  UserCog,
} from "lucide-react";
const Page = () => {
  const { user, darkMode } = useAppContext(); // theme
  return (
    <div className="grid  grid-cols-[1.8fr_2.8fr_1.4fr] gap-3 h-[94vh] bg-accent px-2 py-2">
      {/* ---------LEFT SIDE ----------------- */}
      <div className="w-full px-2 flex flex-col justify-between pt-4 pb-7">
        {/* user profile */}
        <div
          className={` ${
            darkMode
              ? "bg-accent-foreground"
              : "bg-gradient-to-bl from-fuchsia-600 via-purple-500 to-purple-800"
          } rounded-lg w-full px-4 py-4 `}
        >
          <div className=" flex gap-5">
            <Image
              src={user?.profilePic || "/placeholder.svg"}
              alt={`${user?.username}'s profile picture`}
              width={180}
              height={180}
              className="rounded-lg object-cover border-[1px] border-accent bg-accent shadow-md aspect-square "
            />
            <div className="flex flex-col relative">
              <h2 className="text-[20px] font-medium tracking-tight text-accent">
                {user?.username}
              </h2>
              <p className="text-[16px] font-[400] tracking-wide text-gray-400 -mt-1">
                {user?.publicId}
              </p>
              <div className=" absolute top-0 right-5 inline ">
                <Star className="text-accent " size={18} />
              </div>
              {/* personal details */}
              <div className="my-5">
                <p className="flex items-center gap-2 text-gray-200 font-light text-[14px]">
                  <Paperclip size={14} /> {user?.email}
                </p>
                <p className="flex items-center gap-2 text-gray-200 font-light text-[14px]">
                  <VenusAndMars size={14} /> {user?.gender}
                </p>
                <p className="flex items-center gap-2 text-gray-200 font-light text-[14px]">
                  <User size={14} /> {user?.age}
                </p>
              </div>
              <div className="px-3 py-1 rounded-md bg-accent/70 backdrop-blur-2xl w-fit mx-auto">
                <p className="text-[14px] font-light tracking-tight flex items-center gap-2">
                  Edit <UserCog size={16} />
                </p>
              </div>
            </div>
          </div>
          {/* other details  */}
          <div className="bg-accent/30 p-2 mt-5 mb-3 rounded-lg flex items-center justify-between  ">
            <div className=" flex flex-col gap-1 items-center">
              <h1 className="text-[15px] text-gray-200 font-medium">
                {" "}
                {user?.followers?.length ?? 0}
              </h1>
              <p className="flex items-center gap-1 text-[12px] font-light tracking-tighter text-gray-300">
                <Users size={16} /> Followers
              </p>
            </div>
            <div className=" flex flex-col gap-1 items-center">
              <h1 className="text-[15px] text-gray-200 font-medium">
                {" "}
                {user?.followed?.length ?? 0}
              </h1>
              <p className="flex items-center gap-1 text-[12px] font-light tracking-tighter text-gray-300">
                <Users size={16} /> Followed
              </p>
            </div>
            <div className=" flex flex-col gap-1 items-center">
              <h1 className="text-[15px] text-gray-200 font-medium">
                {" "}
                {user?.likes}
              </h1>
              <p className="flex items-center gap-1 text-[12px] font-light tracking-tighter text-gray-300">
                <Heart size={16} /> Likes
              </p>
            </div>
            <div className=" flex flex-col gap-1 items-center">
              <h1 className="text-[15px] text-gray-200 font-medium">
                {" "}
                {user?.totalComments ?? 0}
              </h1>
              <p className="flex items-center gap-1 text-[12px] font-light tracking-tighter text-gray-300">
                <MessageSquare size={16} /> Comments
              </p>
            </div>
          </div>
        </div>
        <div className="w-[65%] bg-white rounded-lg px-4 py-2">
          <Sidebar />
        </div>
      </div>

      {/* MIDDLE SIDE */}
      <div className=" bg-white rounded-lg">Middle</div>

      {/* RIGHT SIDE - 1fr */}
      <div className=" bg-white rounded-lg">Right</div>
    </div>
  );
};

export default Page;
