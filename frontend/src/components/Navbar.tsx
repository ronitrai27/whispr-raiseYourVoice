"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { ChevronDown, Mail, Search, Sun, Moon, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, darkMode, toggleDarkMode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
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
      <motion.div
        className="flex items-center border-[.6px] border-purple-200 rounded-lg px-2 py-1 bg-white shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-purple-300 focus-within:border-purple-400 transition-all duration-200"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <input
          type="text"
          placeholder="Search here..."
          className="min-w-[380px] px-2 py-1 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent transition-colors duration-200"
          onFocus={(e) => (e.target.placeholder = "")}
          onBlur={(e) => (e.target.placeholder = "Search here...")}
        />
        <motion.div
          className="text-purple-500"
          whileHover={{ rotate: 10, scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Search size={20} />
        </motion.div>
      </motion.div>
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
