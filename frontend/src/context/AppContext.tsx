"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
type UserType = {
  _id: string;
  username: string;
  publicId: string;
  email: string;
  gender: "male" | "female" | "other";
  age: number;
  profilePic: string;
  likes: number;
  followers: string[];
  followed: string[];
  totalComments: number;
  bookmarked: string[];
  createdAt: string;
  updatedAt: string;
};

type AppContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user on app load", err);
      }
    };

    fetchUser(); // only runs on first mount (including refresh)
  }, []);

  return (
    <AppContext.Provider
      value={{ user, setUser, darkMode, setDarkMode, toggleDarkMode }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
