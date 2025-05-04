"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Existing login email only
interface ProfileContextType {
  email: string;
  setEmail: (email: string) => void;

  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

// Profile state interface
interface ProfileData {
  profilePic: string;
  username: string;
  email: string;
  age: string;
  gender: string;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState(""); // For login only

  const [profileData, setProfileData] = useState<ProfileData>({
    profilePic: "",
    username: "",
    email: "",
    age: "",
    gender: "",
  });

  return (
    <ProfileContext.Provider
      value={{ email, setEmail, profileData, setProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
