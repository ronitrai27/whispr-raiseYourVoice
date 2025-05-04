"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/context/ProfileContext";
import {
  Camera,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Users,
  Loader,
  UserCheck,
  UserX,
  UserSearch,
  UserPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";
import debounce from "lodash.debounce";
interface ProfileSetupProps {
  onComplete: () => void;
}

type ProfileData = {
  profilePic: string;
  username: string;
  email: string;
  age: string;
  gender: string;
};

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState(0);
  const { profileData, setProfileData } = useProfile();
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );
  const [checkingUsername, setCheckingUsername] = useState(false);
  //=--------------
  const checkUsername = debounce(async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const res = await axios.post("/api/username-check", { username });
      setUsernameAvailable(res.data.available); // should return true or false
    } catch (err) {
      console.error("Username check failed", err);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  }, 500); // delay to avoid spamming API
  useEffect(() => {
    checkUsername(profileData.username);
  }, [profileData.username]);

  // ---------------------
  const steps = [
    { name: "Profile Picture", icon: <Camera className="h-4 w-4" /> },
    { name: "Username", icon: <User className="h-4 w-4" /> },
    { name: "Email", icon: <Mail className="h-4 w-4" /> },
    { name: "Age", icon: <Calendar className="h-4 w-4" /> },
    { name: "Gender", icon: <Users className="h-4 w-4" /> },
  ];

  const updateProfile = (key: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 0:
        return (
          profileData.profilePic !== null &&
          profileData.profilePic.trim() !== ""
        );

      case 1:
        return profileData.username.length >= 4 && usernameAvailable === true;
      case 2:
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email);
      case 3:
        return profileData.age !== "" && !isNaN(Number(profileData.age));
      case 4:
        return profileData.gender !== "";
      default:
        return false;
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // function --- upload

  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB.");
      toast.error("File size exceeds 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("file", file);

    console.log("Uploading file:", file.name, file.size, file.type);

    try {
      const res = await axios.post("/api/upload", formData); // No headers
      const imageUrl = res.data.url;
      updateProfile("profilePic", imageUrl);
      toast.success("Profile picture uploaded successfully! ");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("❌ Upload error:", error);
      const errorMessage =
        error.response?.data?.message || "Image upload failed. Try again.";
      setUploadError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="h-screen w-full select-none ">
      {/* <div className="logo-container relative w-20 h-20 mt-5 ml-12">
        <div className="logo-bg absolute w-12 h-12 rounded-2xl bg-purple-600" />
        <div className="logo-text absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[32px] text-white tracking-tight">
          <h2> Whispr.</h2>
        </div>
      </div> */}
      <div className="max-w-xl mx-auto -mt-5">
        <div className="bg-pink-50 rounded-lg shadow-xl shadow-purple-200/30 overflow-hidden border border-purple-500/30 z-50">
          <div className="px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
            <h3 className="text-purple-200  text-[22px] font-medium flex items-center gap-2">
              Let&apos;s set up your profile{" "}
              <UserPen className="text-[18px] inline" />
            </h3>
          </div>

          {/* Progress bar */}
          <div className="px-8 pt-6">
            <div className="flex justify-between mb-3">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center",
                    i <= step ? "text-purple-600" : "text-gray-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300",
                      i < step
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md"
                        : i === step
                        ? "border-2 border-purple-600 shadow-md"
                        : "border-2 border-gray-400"
                    )}
                  >
                    {i < step ? <CheckCircle className="h-5 w-5" /> : s.icon}
                  </div>
                  <span className="text-xs hidden sm:block">{s.name}</span>
                </div>
              ))}
            </div>
            <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Form steps */}
          <div className="p-8 min-h-[350px] flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex-1"
              >
                {/* step -0  */}
                {step === 0 && (
                  <div className="space-y-6 text-center">
                    <h2 className="text-2xl font-medium text-gray-800 capitalize">
                      Add a profile picture
                    </h2>
                    <p className="text-purple-600 opacity-70 text-sm capitalize tracking-wide">
                      A ghost should have a face too !
                    </p>

                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-40 h-40 mb-6 group">
                        {profileData.profilePic ? (
                          <img
                            src={profileData.profilePic || "/placeholder.svg"}
                            alt="Profile preview"
                            className="w-40 h-40 rounded-full object-cover border-4 border-purple-200 shadow-lg transition-all duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-purple-200 shadow-lg transition-all duration-300 group-hover:scale-105">
                            <User className="h-20 w-20 text-purple-300" />
                          </div>
                        )}
                        <label
                          htmlFor="profile-pic"
                          className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
                        >
                          <Camera className="h-5 w-5" />
                        </label>
                        <input
                          id="profile-pic"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePicChange}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Click the camera icon to upload
                      </p>
                      {/* Show loading spinner when uploading */}
                      {isUploading && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader className="h-5 w-5 animate-spin text-purple-600" />
                          <p className="capitalize text-sm tracking-tight text-gray-600">
                            Just a moment
                          </p>
                        </div>
                      )}
                      {/* Show error message if upload fails */}
                      {uploadError && (
                        <p className="text-red-500 text-sm mt-2">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* --------- */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Choose a username
                    </h2>
                    <p className="text-gray-500 text-sm">
                      This is how others will see you on Whispr
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="e.g., whispr_lover"
                        value={profileData.username}
                        onChange={(e) =>
                          updateProfile("username", e.target.value)
                        }
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl px-4 py-3 shadow-sm"
                      />
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        {profileData.username.length < 4 ? (
                          "Username must be at least 4 characters"
                        ) : checkingUsername ? (
                          <span className="flex items-center gap-1">
                            <UserSearch className="text-[12px]" /> Checking
                            availability...
                          </span>
                        ) : usernameAvailable === true ? (
                          <span className="text-green-500 flex items-center gap-1">
                            <UserCheck className="text-[12px]" /> Username
                            available
                          </span>
                        ) : usernameAvailable === false ? (
                          <span className="text-red-500 flex items-center gap-1">
                            <UserX className="text-[12px]" /> Username already
                            taken
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      What's your email?
                    </h2>
                    <p className="text-gray-500 text-sm">
                      We'll use this for account recovery
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={profileData.email}
                        onChange={(e) => updateProfile("email", e.target.value)}
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl px-4 py-3 shadow-sm"
                      />
                      {profileData.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                          profileData.email
                        ) && (
                          <p className="text-xs text-red-500">
                            Please enter a valid email address
                          </p>
                        )}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      How old are you?
                    </h2>
                    <p className="text-gray-500 text-sm">
                      This helps us personalize your experience
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        min="13"
                        max="120"
                        value={profileData.age}
                        onChange={(e) => updateProfile("age", e.target.value)}
                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl px-4 py-3 shadow-sm"
                      />
                      {profileData.age &&
                        (Number(profileData.age) < 13 ||
                          Number(profileData.age) > 120) && (
                          <p className="text-xs text-red-500">
                            Age must be between 13 and 120
                          </p>
                        )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      What's your gender?
                    </h2>
                    <p className="text-gray-500 text-sm">
                      This helps us personalize your experience
                    </p>

                    <RadioGroup
                      value={profileData.gender}
                      onValueChange={(value) => updateProfile("gender", value)}
                      className="grid grid-cols-1 gap-4 pt-2"
                    >
                      {["Male", "Female", "Others"].map((gender) => (
                        <div
                          key={gender}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={gender.toLowerCase()}
                            id={gender.toLowerCase()}
                            className="text-purple-600 border-purple-200"
                          />
                          <Label
                            htmlFor={gender.toLowerCase()}
                            className="flex-1 py-2 px-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-purple-50 transition-colors"
                          >
                            {gender}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
                className={cn(
                  "border-purple-200 text-purple-600 hover:bg-purple-50 rounded-xl px-5 transition-all duration-300 cursor-pointer",
                  step === 0 && "opacity-0 pointer-events-none"
                )}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={nextStep}
                disabled={!isStepComplete()}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl px-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {step === steps.length - 1 ? "Complete" : "Next"}
                {step !== steps.length - 1 && (
                  <ChevronRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
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
}
