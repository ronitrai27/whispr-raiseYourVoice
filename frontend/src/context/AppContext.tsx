"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api from "@/lib/api";
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

type DiscoverUserType = {
  _id: string;
  username: string;
  publicId: string;
  profilePic: string;
};

type AppContextType = {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  darkMode: boolean;
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>; // Added
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDarkMode: () => void;
  discoverUsers: DiscoverUserType[];
  fetchDiscoverUsers: () => void;
  shuffleDiscoverUsers: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [discoverUsers, setDiscoverUsers] = useState<DiscoverUserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // USER DATA FROM FRONTEND
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/me");
        setUser(res.data.user);
        setCurrentUser(res.data.user); // Optionally set currentUser here
      } catch (err) {
        console.error("Failed to fetch user on app load", err);
      }
    };

    fetchUser();
  }, []);

  // ----------DISCOVER USERS-------------------
  const fetchDiscoverUsers = async () => {
    try {
      const res = await api.get("/api/discover/people");
      setDiscoverUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch Discover users", err);
    }
  };

  const shuffleDiscoverUsers = () => {
    fetchDiscoverUsers();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        darkMode,
        setDarkMode,
        toggleDarkMode,
        discoverUsers,
        fetchDiscoverUsers,
        shuffleDiscoverUsers,
        currentUser, // Added
        setCurrentUser, // Added
      }}
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

// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import api from "@/lib/api";
// import axios from "axios";

// type UserType = {
//   _id: string;
//   username: string;
//   publicId: string;
//   email: string;
//   gender: "male" | "female" | "other";
//   age: number;
//   profilePic: string;
//   likes: number;
//   followers: string[];
//   followed: string[];
//   totalComments: number;
//   bookmarked: string[];
//   createdAt: string;
//   updatedAt: string;
// };

// type DiscoverUserType = {
//   _id: string;
//   username: string;
//   publicId: string;
//   profilePic: string;
// };
// type AppContextType = {
//   user: UserType | null;
//   setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
//   darkMode: boolean;
//   currentUser: UserType | null;
//   setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
//   toggleDarkMode: () => void;
//   discoverUsers: DiscoverUserType[];
//   fetchDiscoverUsers: () => void;
//   shuffleDiscoverUsers: () => void;
// };

// const AppContext = createContext<AppContextType | undefined>(undefined);

// export const AppProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [darkMode, setDarkMode] = useState<boolean>(true);
//   const [discoverUsers, setDiscoverUsers] = useState<DiscoverUserType[]>([]);
//   const [currentUser, setCurrentUser] = useState<UserType | null>(null); // has 5 random people to follow

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);

//   // USER DATA FROM FRONTEND
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axios.get("/api/user/me");
//         setUser(res.data.user);
//       } catch (err) {
//         console.error("Failed to fetch user on app load", err);
//       }
//     };

//     fetchUser();
//   }, []);

//   // ----------DISCOVER USERS-------------------
//   const fetchDiscoverUsers = async () => {
//     try {
//       const res = await api.get("/api/discover/people");
//       setDiscoverUsers(res.data.users);
//     } catch (err) {
//       console.error("Failed to fetch Discover users", err);
//     }
//   };

//   const shuffleDiscoverUsers = () => {
//     fetchDiscoverUsers();
//   };

//   return (
//     <AppContext.Provider
//       value={{
//         user,
//         setUser,
//         darkMode,
//         setDarkMode,
//         toggleDarkMode,
//         discoverUsers,
//         fetchDiscoverUsers,
//         shuffleDiscoverUsers,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useAppContext must be used within AppProvider");
//   }
//   return context;
// };
