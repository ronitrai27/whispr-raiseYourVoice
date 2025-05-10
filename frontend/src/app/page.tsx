"use client";

import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import useSocket from "@/lib/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleFadingPlus,
  Tent,
  PenLine,
  Share2,
  AtSign,
  Vote,
  ChevronDown,
  // ChevronUp,
  Globe,
  SquarePen,
  ListFilter,
  Search,
  Flame,
  X,
  Send,
  Lock,
  PlusIcon,
  UserPlus,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AIOptions from "@/components/AiPopOver";
import TopicOptions from "@/components/TopicPopOver";
import { validateComment } from "@/schemas/commentValidator";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { FollowedUserPreview } from "@/types/banner";
// import axios from "axios";

export default function Home() {
  const {
    user,
    darkMode,
    discoverUsers,
    fetchDiscoverUsers,
    shuffleDiscoverUsers,
    currentUser,
    setCurrentUser,
  } = useAppContext(); //main context

  // USER COMMENTS STATES---------
  const { socket } = useSocket(); // Get socket instance from custom hook
  const [followedProfiles, setFollowedProfiles] = useState<
    FollowedUserPreview[]
  >([]); // contains data of banners to be displayed
  const [isDiscoverTab, setIsDiscoverTab] = useState(false); // toggle for PRIMARY or DISCOVER tab
  const [isModalOpen, setIsModalOpen] = useState(false); // for main modal window
  const [thought, setThought] = useState(""); // for user comment
  const [wordCount, setWordCount] = useState(0); // for word count
  const [isPublic, setIsPublic] = useState(true); // for public/private toggle
  const [dropdownOpen, setDropdownOpen] = useState(false); // for PUBLIC PRIVATE
  const [topics, setTopics] = useState<string[]>([]); // for topics array
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [error, setError] = useState<string | null>(null); // for error logs
  //PUBLIC PRIVATE TOGGLE---------------------------------------
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const handleSelect = (value: boolean) => {
    setIsPublic(value);
    setDropdownOpen(false);
  };
  // DICOVER TAB ------------------------------------------
  const [hasFetchedDiscover, setHasFetchedDiscover] = useState(false);

  const handleTabClick = (tab: string) => {
    if (tab === "discover" && !hasFetchedDiscover) {
      fetchDiscoverUsers(); // Only fetch once when first clicking Discover
      setHasFetchedDiscover(true); // Mark that data has been fetched
    }
    setIsDiscoverTab(tab === "discover"); // Switch tab
  };

  // TOPICS ----------------------------------------------------
  const handleAddTopic = () => {
    const formatted = `#${newTopic.toLowerCase().replace(/\s+/g, "")}`;
    if (!topics.includes(formatted) && newTopic.trim() !== "") {
      setTopics([...topics, formatted]);
      setNewTopic("");
    }
  };

  const removeTopic = (tag: string) => {
    setTopics(topics.filter((t) => t !== tag));
  };

  //  WORD COUNT-----------------------------------------------

  const handleThoughtChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setThought(value);
    const count = value.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);
  };
  // HANDLE SUBMIT -----------------------------------------------
  // Handle form submission
  //---------------------------------------------------------------
  const handleSubmit = async () => {
    setError(null);

    // Validate with Zod
    const validationResult = validateComment({ thought, topics, isPublic });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0].message);
      return;
    }
    try {
      const response = await api.post("/api/comments/create", {
        text: thought,
        topics: topics,
        isPublic: isPublic,
      });

      console.log("Comment posted:", response.data);
      toast.success("Comment Posted Successfully.");

      // Clear form
      setThought("");
      setTopics([]);
      setIsPublic(true);
      setWordCount(0);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error posting comment:", err);
      toast.error("Error ! please try later.");
      setError("Failed to post comment. Please try again.");
    }
  };
  // -----------------------------------------------------------------
  //-----------CURRENT USER DATA FROM DB
  //-------------------------------------------------
  const fetchCurUser = useCallback(async () => {
    try {
      const res = await api.get("/api/users/call/myself");

      if (res.data && res.data.user) {
        setCurrentUser(res.data.user);
      }
    } catch (err) {
      console.error("🔥 Failed to fetch user on app load", err);
    }
  }, []);

  useEffect(() => {
    fetchCurUser();
  }, [fetchCurUser]);

  //--------------------------------------------------------------
  // SOCKET LISTENERS --------------------------------------------
  //--------------------------------------------------------------
  useEffect(() => {
    if (socket) {
      const handleFollow = ({ followerId, targetId }) => {
        if (user?._id === targetId || user?._id === followerId) {
          fetchCurUser(); // <-- call the central function
        }
      };

      const handleUnfollow = ({ followerId, targetId }) => {
        if (user?._id === targetId || user?._id === followerId) {
          fetchCurUser();
        }
      };

      socket.on("update-follow", handleFollow);
      socket.on("update-unfollow", handleUnfollow);

      return () => {
        socket.off("update-follow", handleFollow);
        socket.off("update-unfollow", handleUnfollow);
      };
    }
  }, [socket, user, fetchCurUser]);
  //----------------------------------------------------------------
  useEffect(() => {
    const fetchFollowedProfiles = async () => {
      try {
        const res = await api.get("/api/users/call/following-profiles");
        setFollowedProfiles(res.data.followedProfiles);
        // console.log("Followed Profiles INSIDE function:", followedProfiles);
      } catch (err) {
        console.error("Failed to fetch followed profiles", err);
      }
    };

    if (currentUser?._id || user?._id) {
      fetchFollowedProfiles();
    }
  }, [currentUser, user]);

  //---------------------------------------------------------------
  // RANDOM BG COLOR FOR DISCOVER USERS
  const bgColors = [
    "bg-purple-200",
    "bg-green-200",
    "bg-pink-200",
    "bg-red-200",
    "bg-blue-200",
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex];
  };
  //---------------------------------------------------------------
  // console.log("User Data:", user);
  // console.log("Current User data initially :", currentUser);
  // console.log("Followed Profiles after function:", followedProfiles);
  //-----------------------------
  return (
    <main
      className={`w-full h-[96vh] select-none px-6 py-2 ${
        darkMode ? "bg-accent-foreground" : "bg-white"
      }`}
    >
      <div className="bg-accent w-full h-full rounded-lg px-3 py-3">
        <div className="grid  grid-cols-[1fr_3fr_1.4fr] gap-3 h-full">
          {/* LEFT SIDE - 1fr */}
          <div className=" rounded-lg flex flex-col justify-between pb-6">
            {/* TOP  */}
            <div className="bg-white p-2 rounded-sm">
              <div
                className={`rounded-md p-2 ${
                  darkMode
                    ? "bg-accent-foreground"
                    : "bg-gradient-to-bl from-fuchsia-600 via-purple-500 to-purple-800"
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  <Image
                    src={user?.profilePic || "/default-avatar.png"}
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    className={`rounded-full h-[50px] w-[50px] object-cover border-[1px] ${
                      darkMode
                        ? "border-accent bg-accent"
                        : "border-white bg-accent"
                    }`}
                  />
                  <div className="flex flex-col items-center relative">
                    <h1
                      className={`font-medium text-[16px] tracking-wide ${
                        darkMode ? "text-white" : "text-white"
                      }`}
                    >
                      {user?.username}
                    </h1>
                    <div className=" absolute w-2 h-2 bg-green-400 rounded-full animate-pulse transition-all duration-300 top-2 -right-3"></div>
                    <p
                      className={`font-light ${
                        darkMode ? "text-gray-400" : "text-gray-300"
                      } text-[14px] tracking-tighter`}
                    >
                      {user?.publicId}
                    </p>
                  </div>
                </div>
                {/* USER FOLLOWINGS--- */}
                <div className="flex items-center justify-between mt-3 px-2 py-1">
                  <div className="flex flex-col items-center">
                    <h1
                      className={`${
                        darkMode ? "text-white" : "text-white"
                      } font-medium text-[15px]`}
                    >
                      {/* {user?.followed?.length ?? 0} */}
                      {currentUser?.followed?.length ?? 0}
                    </h1>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-300"
                      } text-[12px] font-light tracking-tight`}
                    >
                      Following
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1
                      className={`${
                        darkMode ? "text-white" : "text-white"
                      } font-medium text-[15px]`}
                    >
                      {/* {user?.followers?.length ?? 0} */}
                      {currentUser?.followers?.length ?? 0}
                    </h1>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-300"
                      } text-[12px] font-light tracking-tight`}
                    >
                      Followers
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <h1
                      className={`${
                        darkMode ? "text-white" : "text-white"
                      } font-medium text-[15px]`}
                    >
                      {user?.likes ?? 0 > 0 ? 0 : user?.likes ?? 0}
                    </h1>
                    <p
                      className={`${
                        darkMode ? "text-gray-400" : "text-gray-300"
                      } text-[12px] font-light tracking-tight`}
                    >
                      Likes
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* MIDDLE */}
            <div className={`bg-white p-2 rounded-sm `}>
              <Sidebar />
            </div>
            {/* BOTTOM */}
            <div className="bg-white py-2 px-4 rounded-sm flex flex-col ">
              <h2 className="flex items-center gap-2 mb-5">
                <Tent size={18} />
                Campaign
              </h2>
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="flex flex-col items-center gap-2 justify-center">
                  <span className="text-[14px] font-light text-gray-500 capitalize tracking-tight">
                    Start creating new campaign
                  </span>
                  <CircleFadingPlus size={16} className="text-gray-500" />
                </p>
                <Image
                  src="/social-media-marketing.png"
                  alt="Campaign"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* MIDDLE SIDE - 3fr */}
          <div className=" flex flex-col gap-2">
            {/* USER FOLLOWERS */}
            <div className={`bg-white py-[6px] px-4 rounded-md`}>
              <div
                className={` flex items-center gap-4 overflow-y-auto scroll-smooth`}
              >
                {/*---- user banner------ */}
                <div className="relative flex flex-col items-center gap-1 shrink-0">
                  <div
                    className={`border-[1.5px] ${
                      darkMode
                        ? "border-accent-foreground"
                        : "border-purple-500"
                    }  rounded-full`}
                  >
                    <Image
                      src={user?.profilePic || "/default-avatar.png"}
                      alt="Profile Picture"
                      width={62}
                      height={62}
                      className={`rounded-full h-[62px] w-[62px] object-cover border-[3px] border-white ${getRandomColor()}`}
                    />
                  </div>

                  <div className="absolute top-10 -right-1.5 bg-accent rounded-full w-5 h-5 flex items-center justify-center cursor-pointer">
                    <PlusIcon size={16} />
                  </div>
                  <p className="text-[12px] font-medium text-gray-800 tracking-tighter">
                    thoughts ?
                  </p>
                </div>
                {/* -----AI BANNER---- */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <Image
                    src="/pixelcut-export (1).jpg"
                    alt="Profile Picture"
                    width={65}
                    height={65}
                    className={`rounded-full h-[65px] w-[65px] object-contain border-[1.8px] border-accent-foreground`}
                  />
                  <p className="text-[12px] font-medium text-gray-800 tracking-tighter">
                    Sara AI
                  </p>
                </div>
                {/* ----ALL FOLLOWING BANNER------ */}
                {followedProfiles.map((person) => (
                  <div
                    key={person._id}
                    className="relative flex flex-col items-center gap-1 shrink-0"
                  >
                    <Link href={`/users/${person.username}`}>
                      <div
                        className={`border-[1.5px] ${
                          darkMode
                            ? "border-accent-foreground"
                            : "border-purple-500"
                        } rounded-full`}
                      >
                        <Image
                          src={person.profilePic || "/default-avatar.png"}
                          alt={person.username}
                          width={62}
                          height={62}
                          className={`rounded-full h-[62px] w-[62px] object-cover border-[3px] border-white ${getRandomColor()}`}
                        />
                      </div>
                    </Link>

                    <p className="text-[12px] font-medium text-gray-800 tracking-tighter">
                      {person.username}
                    </p>
                  </div>
                ))}

                {followedProfiles.length < 6 &&
                  discoverUsers.map((person) => (
                    <div
                      key={person._id}
                      className="relative flex flex-col items-center gap-1 shrink-0"
                    >
                      <Link href={`/users/${person.username}`}>
                        <div
                          className={`border-[1.5px] ${
                            darkMode
                              ? "border-accent-foreground"
                              : "border-purple-500"
                          } rounded-full`}
                        >
                          <Image
                            src={person.profilePic || "/default-avatar.png"}
                            alt={person.username}
                            width={62}
                            height={62}
                            className={`rounded-full h-[62px] w-[62px] object-cover border-[3px] border-white ${getRandomColor()}`}
                          />
                        </div>
                      </Link>
                      <div
                        className="absolute top-10 -right-1.5 bg-accent rounded-full w-5 h-5 flex items-center justify-center cursor-pointer"
                        // onClick={() => handleFollow(person._id)}
                      >
                        <PlusIcon size={16} />
                      </div>
                      <p className="text-[12px] font-medium text-gray-800 tracking-tighter">
                        {person.username}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            {/* USER POST */}
            <div className="bg-white px-3 py-[6px] rounded-md mt-2">
              <div
                className="flex items-center gap-5"
                // onClick={() => setIsModalOpen(true)}
              >
                <Image
                  src={user?.profilePic || "/default-avatar.png"}
                  alt="Profile Picture"
                  width={45}
                  height={45}
                  className={`object-contain w-[45px] h-[45px] rounded-full ${
                    darkMode ? "bg-accent-foreground" : "bg-purple-500"
                  } `}
                />
                <div
                  className="flex items-center w-full px-4 py-[6px] bg-accent rounded-lg justify-between"
                  onClick={() => setIsModalOpen(true)}
                >
                  <input
                    type="text"
                    placeholder="your thoughts.."
                    className="bg-transparent  w-full outline-none text-[14px] font-light text-gray-600 placeholder:text-purple-600"
                  />
                  <PenLine size={16} className="text-gray-400" />
                </div>
                {/* button */}
                <button
                  type="submit"
                  className="group relative cursor-pointer w-36 border bg-white rounded-xl overflow-hidden text-black font-medium hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="translate-x-4 group-hover:translate-x-12 group-hover:opacity-0 transition-all duration-500 ease-in-out inline-block  py-[4px]">
                    Share
                  </span>
                  <div className="flex gap-2 text-white z-10 items-center absolute top-0 h-full w-full justify-center translate-x-12 opacity-0 group-hover:-translate-x-1 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <span>Share</span>
                    <Share2 className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                  <div className="absolute top-[50%] left-[15%] -translate-y-1/2 h-2 w-2 group-hover:h-full group-hover:w-full rounded-lg bg-[#7560d5] scale-[1] dark:group-hover:bg-[#7560d5] group-hover:bg-[#7560d5] group-hover:scale-[1.8] transition-all duration-500 ease-out group-hover:top-[0%] group-hover:left-[0%] group-hover:translate-y-0"></div>
                </button>
              </div>

              {/* Modal and Overlay */}
              <AnimatePresence>
                {isModalOpen && (
                  <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20 }}
                    className="fixed inset-0 z-50 flex items-center justify-center"
                  >
                    {/* Overlay */}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setIsModalOpen(false)}
                      className="absolute inset-0 backdrop-blur-sm bg-black/30"
                    ></motion.div>

                    {/* Modal */}
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="relative z-10 bg-white p-3 rounded-md w-[90%] max-w-xl shadow-lg"
                    >
                      <div className="flex gap-5 mb-5">
                        <Image
                          src={user?.profilePic || "/default-avatar.png"}
                          alt="Profile Picture"
                          width={40}
                          height={40}
                          className="object-contain w-[40px] h-[40px] rounded-full border-[1px] border-purple-500"
                        />
                        <div className="flex flex-col items-center ">
                          <h2 className="text-[16px] font-medium text-gray-600 tracking-tight capitalize self-start">
                            {user?.username}
                          </h2>
                          {/* PRIVATE / PUBLIC */}
                          <div className="relative w-fit">
                            {/* Main Display */}
                            <div
                              onClick={toggleDropdown}
                              className="flex items-center justify-between gap-2 px-2 py-[6px] bg-accent border rounded-md cursor-pointer hover:shadow-sm transition"
                            >
                              <p className="flex items-center gap-1 text-sm text-gray-600">
                                {isPublic ? (
                                  <>
                                    Public{" "}
                                    <Globe
                                      size={16}
                                      className="text-gray-400"
                                    />
                                  </>
                                ) : (
                                  <>
                                    Private{" "}
                                    <Lock size={16} className="text-gray-400" />
                                  </>
                                )}
                              </p>
                              <ChevronDown
                                size={16}
                                className={`transition-transform text-gray-400 ${
                                  dropdownOpen ? "rotate-180" : ""
                                }`}
                              />
                            </div>

                            {/* Dropdown Options */}
                            <AnimatePresence>
                              {dropdownOpen && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                  className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md overflow-hidden"
                                >
                                  <div
                                    onClick={() => handleSelect(true)}
                                    className="px-2 py-[6px] text-sm hover:bg-purple-50 cursor-pointer flex items-center gap-2 text-gray-700"
                                  >
                                    <Globe size={16} /> Public
                                  </div>
                                  <div
                                    onClick={() => handleSelect(false)}
                                    className="px-2 py-[6px] text-sm hover:bg-purple-50 cursor-pointer flex items-center gap-2 text-gray-700"
                                  >
                                    <Lock size={16} /> Private
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* TEXT AREA */}
                      <div className="relative">
                        <textarea
                          value={thought}
                          onChange={handleThoughtChange}
                          className="w-full h-48 p-2 border bg-accent rounded-md resize-none outline-none"
                          placeholder="Share your thoughts..."
                        ></textarea>

                        {/* Word Counter */}
                        <div
                          key={wordCount}
                          className="absolute bottom-2 right-3 text-xs text-gray-500 animate-fadeScale"
                        >
                          {wordCount} word{wordCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                      {/* ---------- */}
                      {/* Error Message */}
                      {error && (
                        <p className="text-purple-500 text-sm tracking-tight my-1">
                          {error}
                        </p>
                      )}
                      <h2 className="text-gray-400 font-medium text-[14px]">
                        # Topics:
                      </h2>

                      {/* Display tags */}
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {topics.map((topic, idx) => (
                            <div
                              key={idx}
                              className="flex items-center bg-purple-100 text-gray-600 px-2 py-1 rounded-full text-sm"
                            >
                              {topic}
                              <X
                                className="ml-2 cursor-pointer hover:text-purple-800"
                                size={14}
                                onClick={() => removeTopic(topic)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-5 mt-3">
                        {/* <div className="rounded-md bg-accent px-2 py-1">
                        <p className="flex items-center gap-1 text-[12px]">
                          <CircleFadingPlus
                            className="text-gray-400"
                            size={16}
                          />{" "}
                          Add Topics
                        </p>
                      </div> */}
                        <div
                          className="rounded-md bg-accent px-2 py-1 cursor-pointer w-fit"
                          onClick={() => setShowTopicInput(!showTopicInput)}
                        >
                          <p className="flex items-center gap-1 text-[12px] text-gray-600 hover:text-gray-800 transition">
                            <CircleFadingPlus
                              className="text-gray-400"
                              size={16}
                            />
                            Add Topics
                          </p>
                        </div>
                        <p className="flex items-center gap-1 bg-accent px-2 py-1 rounded-md">
                          <Vote
                            size={16}
                            className="text-[16px] text-green-400"
                          />
                          <span className="text-[12px] font-medium tracking-tight text-gray-600">
                            Poll
                          </span>
                        </p>
                      </div>
                      {showTopicInput && (
                        <div className="flex gap-2 items-center justify-between mt-3 w-full pl-4 py-1 border bg-accent rounded-md">
                          <input
                            type="text"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTopic();
                              }
                            }}
                            className="outline-none placeholder:text-purple-400 text-[12px] w-full"
                            placeholder="#whispr   #RaiseYourVoice ..."
                          />
                          <div
                            className="bg-white rounded-md w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-purple-100  transition"
                            onClick={handleAddTopic}
                          >
                            <Send
                              size={18}
                              className="text-gray-800 hover:rotate-45 transition-transform duration-200"
                            />
                          </div>
                        </div>
                      )}
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="px-4 py-1 text-[16px] bg-purple-300 text-purple-600 font-bold rounded-md w-full hover:bg-purple-500 hover:text-white mt-3 mb-1 "
                      >
                        <h3>Post</h3>
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ----------- */}
              <hr className="border-b-[0.2px] border-purple-200/40 w-[80%] mx-auto my-2" />
              <div className="flex items-center justify-between px-10">
                <div className="flex items-center gap-5">
                  <AIOptions />
                  <TopicOptions />
                  <p className="flex items-center gap-1 ">
                    <AtSign size={16} className="text-[16px] text-red-400" />
                    <span className="text-[14px] font-medium tracking-tight text-gray-600">
                      Mention
                    </span>
                  </p>
                  <p className="flex items-center gap-1 ">
                    <Vote size={16} className="text-[16px] text-green-400" />
                    <span className="text-[14px] font-medium tracking-tight text-gray-600">
                      Poll
                    </span>
                  </p>
                </div>
                {/* public/private */}
                <div className="relative w-fit">
                  {/* Main Display */}
                  <div
                    onClick={toggleDropdown}
                    className="flex items-center justify-between gap-2 px-3 py-1 bg-accent border rounded-md cursor-pointer hover:shadow-sm transition"
                  >
                    <p className="flex items-center gap-1 text-sm text-gray-600">
                      {isPublic ? (
                        <>
                          Public <Globe size={16} className="text-gray-400" />
                        </>
                      ) : (
                        <>
                          Private <Lock size={16} className="text-gray-400" />
                        </>
                      )}
                    </p>
                    <ChevronDown
                      size={16}
                      className={`transition-transform text-gray-400 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Dropdown Options */}
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md overflow-hidden"
                      >
                        <div
                          onClick={() => handleSelect(true)}
                          className="px-3 py-2 text-sm hover:bg-purple-50 cursor-pointer flex items-center gap-2 text-gray-700"
                        >
                          <Globe size={16} /> Public
                        </div>
                        <div
                          onClick={() => handleSelect(false)}
                          className="px-3 py-2 text-sm hover:bg-purple-50 cursor-pointer flex items-center gap-2 text-gray-700"
                        >
                          <Lock size={16} /> Private
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center">
              <hr className="border-b-[0.5px] border-purple-200/40  w-[70%]" />
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-[14px]">Sort By:</p>
                <p className="text-purple-500 font-light tracking-tight text-[14px] flex items-center gap-1">
                  All <ChevronDown size={16} className="text-gray-400" />
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - 1fr */}
          <div className="flex flex-col gap-5">
            {/* MESSAGES */}
            <div className="px-4 py-2 bg-white rounded-md min-h-[30.5rem]">
              <h1 className="flex items-center justify-between">
                <span className="font-medium text-[18px]">Messages</span>
                <SquarePen size={18} className="text-gray-400" />
              </h1>
              <div className="flex items-center justify-between mt-4 bg-accent rounded-lg px-2 py-1">
                <div className="flex items-center gap-2">
                  <Search size={18} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-transparent w-full"
                  />
                </div>
                <ListFilter size={18} className="text-gray-400" />
              </div>

              {/* ------------PRIMARY/ DISCOVER---------------- */}
              {/* TAB HEADER */}
              <div className="flex items-center justify-between mt-6 px-16">
                <h3
                  className={`font-medium text-[16px] tracking-tight cursor-pointer ${
                    !isDiscoverTab ? "text-gray-800" : "text-gray-400"
                  }`}
                  onClick={() => handleTabClick("primary")}
                >
                  Primary
                </h3>
                <h3
                  className={`font-medium text-[16px] tracking-tight cursor-pointer ${
                    isDiscoverTab ? "text-gray-800" : "text-gray-400"
                  }`}
                  onClick={() => handleTabClick("discover")}
                >
                  Discover
                </h3>
              </div>

              <hr className="border-b-[0.5px] border-purple-200/40 w-[80%] mx-auto my-2" />

              {/* PRIMARY TAB CONTENT HARD CODED ---------------------------------- */}
              {!isDiscoverTab && (
                <div className="flex flex-col w-full">
                  {/* PEOPLE */}
                  <div className="flex items-center gap-4 relative mt-2">
                    <Image
                      src="/pixelcut-export (1).jpg"
                      alt="AI"
                      width={50}
                      height={50}
                      className="object-contain rounded-full h-[50px] w-[50px] border-[1px] border-purple-500"
                    />
                    <div className="absolute w-3 h-3 bg-green-600 rounded-full top-8 right-[16rem]"></div>
                    <p className="text-gray-800 font-medium text-[16px]">
                      Sara AI
                    </p>
                  </div>
                  {/* STATIC CONTENT */}
                  <div className="flex flex-col items-center justify-center mt-5">
                    <p className="text-gray-400 tracking-tight font-light px-16 text-center mb-6">
                      Your Partners Messages will be shown here
                    </p>
                    <Image
                      src="/family2.png"
                      alt="Messages"
                      width={150}
                      height={150}
                      className="mb-5"
                    />
                  </div>
                </div>
              )}

              {/* DISCOVER TAB CONTENT */}
              {isDiscoverTab && (
                <div className="flex flex-col w-full mt-3">
                  <div className="flex items-center justify-between px-10 mb-3">
                    <h3 className="text-[15px] font-medium text-gray-400  text-center capitalize">
                      Discover New People
                    </h3>
                    {/* SHUFFLE BUTTON */}
                    <button
                      onClick={shuffleDiscoverUsers}
                      className={`text-[12px] font-medium text-white ${
                        darkMode
                          ? "bg-accent-foreground hover:bg-black"
                          : "bg-purple-500 hover:bg-purple-600"
                      } rounded-md px-2 py-1 cursor-pointer transition`}
                    >
                      <h1>shuffle</h1>
                    </button>
                  </div>

                  {/* MAP DISCOVER USERS */}
                  <div className="flex flex-col gap-3">
                    {discoverUsers.length > 0 ? (
                      discoverUsers.map((user) => (
                        <div
                          key={user.publicId}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`border-[1.5px] ${
                              darkMode
                                ? "border-accent-foreground"
                                : "border-purple-500"
                            }  rounded-full`}
                          >
                            <Image
                              src={user.profilePic}
                              alt={user.username}
                              width={45}
                              height={45}
                              className={`rounded-full border-[3px] border-white ${getRandomColor()}`}
                            />
                          </div>

                          <div className="flex flex-col">
                            <p className="text-gray-800 font-medium text-[15px] tracking-tight">
                              {user.username}
                            </p>
                            <h1 className="text-gray-400 text-sm tracking-tight text-[12px]">
                              {user.publicId}
                            </h1>
                          </div>

                          <Link
                            href={`/users/${user.username}`}
                            className="ml-auto border-[.5px] border-gray-400 bg-accent px-2 py-1 rounded-md transition cursor-pointer"
                          >
                            <UserPlus size={16} className="text-gray-800" />
                          </Link>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-between mt-5 gap-5">
                        <h1 className="text-gray-400 font-medium text-[16px]">
                          Nothing here to load...
                        </h1>
                        <Image
                          src="/family2.png"
                          alt="Messages"
                          width={130}
                          height={130}
                          className="mt-5"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ----------TRENDING TOPICS------------ */}
            <div
              className={` ${
                darkMode
                  ? "bg-accent-foreground"
                  : "bg-gradient-to-bl from-fuchsia-600 via-purple-500 to-purple-800"
              } rounded-md px-4 py-3`}
            >
              <h2 className="flex item-center gap-2 mb-2">
                <Flame size={18} className="text-yellow-600" />
                <span
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-100"
                  } text-[16px] font-medium`}
                >
                  # Trending Topics
                </span>
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  "#Corruption",
                  "#Politician",
                  "#Doomsday",
                  "#China",
                  "#Semiconductor",
                  "#Layoffs",
                  "#Victimcard",
                ].map((tag, index) => (
                  <span
                    key={index}
                    className={`text-center bg-purple-100/20 rounded-md py-1 px-2 ${
                      darkMode ? "text-gray-300" : "text-gray-300"
                    } text-[14px] font-medium tracking-tighter block w-fit m-auto`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
