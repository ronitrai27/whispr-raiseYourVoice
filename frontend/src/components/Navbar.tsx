"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import {
  ChevronDown,
  Mail,
  Search,
  Sun,
  Moon,
  LogOut,
  ArrowUpRight,
  CircleUserRound,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import api from "@/lib/api";
import { SearchUser } from "@/types/searchUser";
import { get } from "lodash";

const Navbar = () => {
  const router = useRouter();
  const { user, darkMode, toggleDarkMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  // FOR INPUT
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [suggestions, setSuggestions] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      await axios.get("/api/auth/logout");
      toast.success(" Logged out successfully");
      router.push("/register");
    } catch (error) {
      toast.error("❌ Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };
  // SEARCH -------------------
  const fetchResults = debounce(async (searchTerm) => {
    if (!searchTerm) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const res = await api.get(`/api/search/search-bar?query=${searchTerm}`);
      setResults(res.data.exactMatches);
      setSuggestions(res.data.suggestions);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchResults(query);
  }, [query]);

  // -----------------------------
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
  // HIGHLIGHT TEXT ------------------------------
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-purple-500 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  // --------------------------------------------

  return (
    <div
      className={`w-full ${
        darkMode ? "bg-accent-foreground" : "bg-white"
      } select-none px-10  pt-3 flex items-center justify-between`}
    >
      {/* LOGO  */}
      <div className="logo-container relative w-20 ">
        <div
          className={`logo-bg absolute w-10 h-10 rounded-xl  ${
            darkMode ? "bg-purple-500" : "bg-purple-300"
          } -mt-5`}
        />
        <div
          className={`logo-text absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[32px] tracking-tight`}
        >
          <h2 className={` ${darkMode ? "text-white" : "text-black"}`}>
            {" "}
            Whispr.
          </h2>
        </div>
      </div>
      {/* INPUT  */}

      <div className="relative min-w-[24rem] max-w-[26rem] ">
        <div className="relative min-w-[24rem] max-w-[26rem]">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm placeholder-gray-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>
        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bg-white border-[1px]  rounded-md shadow-md w-full mt-2 z-20"
            >
              {loading && (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-3 animate-pulse"
                    >
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && (
                <>
                  <div className="py-2 px-3">
                    <h1 className="text-[15px] font-medium tracking-tight text-purple-500 mb-3">
                      Top Results
                    </h1>

                    {results.length > 0 ? (
                      results.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between px-4 hover:bg-accent rounded-lg py-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.profilePic}
                              alt="profile"
                              width={50}
                              height={50}
                              className={`rounded-full border-[3px] border-white object-cover ${getRandomColor()} `}
                            />

                            <div>
                              <p className="font-medium text-[14px] tracking-wide">
                                {/* {user.username} */}
                                {highlightMatch(user.username, query)}
                              </p>
                              <h1 className="text-[12px] text-gray-400 tracking-tighter">
                                {/* {user.publicId} */}
                                {highlightMatch(user.publicId, query)}
                              </h1>
                            </div>
                          </div>
                          <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                            <ArrowUpRight
                              size={16}
                              className={`${
                                darkMode
                                  ? "text-accent-foreground"
                                  : "text-purple-500"
                              } `}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1 className="flex items-center gap-3 text-[16px] font-medium text-gray-400 justify-center">
                        No exact matches found <CircleUserRound size={18} />
                      </h1>
                    )}
                  </div>

                  <div className="py-2 px-3">
                    <hr className="w-[80%] border-[0.8px] border-b-accent mx-auto my-2" />
                    <h1 className=" px-2 py-1 text-[15px] font-medium text-accent-foreground">
                      Suggestions
                    </h1>
                    {suggestions.length > 0 ? (
                      suggestions.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.profilePic}
                              alt="profile"
                              width={50}
                              height={50}
                              className={`rounded-full border-[3px] border-white object-cover ${getRandomColor()} `}
                            />

                            <div>
                              <p className="font-medium text-[14px] tracking-wide">
                                {user.username}
                              </p>
                              <h1 className="text-[12px] text-gray-400 tracking-tighter">
                                {user.publicId}
                              </h1>
                            </div>
                          </div>
                          <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                            <ArrowUpRight
                              size={16}
                              className={`${
                                darkMode
                                  ? "text-accent-foreground"
                                  : "text-purple-500"
                              } `}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1 className="flex items-center gap-3 text-[16px] font-medium text-gray-400 justify-center my-3">
                        No Suggestion Available
                        <CircleUserRound size={18} />
                      </h1>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ICONS */}
      <div className="flex items-center gap-8">
        <div
          className={` ${
            darkMode ? "bg-accent/20 text-white" : "bg-accent"
          } flex items-center justify-center rounded-md w-10 h-10 cursor-pointer hover:shadow-md transition-all duration-200`}
        >
          <Mail size={20} />
        </div>

        {/* Profile data */}
        <div
          className="relative flex items-center gap-3 mr-10"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <Image
            src={user?.profilePic || "/default.png"}
            alt="profile"
            width={50}
            height={50}
            className="w-[50px] h-[50px] rounded-full object-cover bg-purple-200 border-[1px] border-purple-600"
          />

          <p
            className={`${
              darkMode ? "text-white" : "text-gray-700"
            } font-medium text-[16px] tracking-wide`}
          >
            {user?.username || "user"}
          </p>
          <motion.div
            className={`flex items-center justify-center ml-1 ${
              darkMode ? "bg-accent/20 text-white" : "bg-accent"
            } rounded-full w-6 h-6 cursor-pointer`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <ChevronDown size={18} />
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute top-14 -right-8 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-2 z-10"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 text-sm rounded-md"
                  onClick={() => {
                    toggleDarkMode();
                    setIsOpen(false);
                  }}
                >
                  {darkMode ? (
                    <div>
                      <Sun size={16} className="inline mr-2" /> Light Mode
                    </div>
                  ) : (
                    <div>
                      <Moon size={16} className="inline mr-2" /> Dark Mode
                    </div>
                  )}
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150 text-sm cursor-pointer rounded-md"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut size={20} className=" inline mr-2" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <style jsx global>{`
        .logo-bg {
          transform: rotate(45deg);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: rotate(45deg) translateY(0);
          }
          50% {
            transform: rotate(45deg) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
