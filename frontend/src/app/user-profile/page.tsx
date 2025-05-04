"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileSetup } from "@/components/profile-setup";
import { toast } from "react-hot-toast";
import { useProfile } from "@/context/ProfileContext";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
export default function Home() {
  const router = useRouter();
  const { setUser, user } = useAppContext();
  const [profileCompleted, setProfileCompleted] = useState(false);
  const { profileData } = useProfile();
  const [countdown, setCountdown] = useState(8);
  useEffect(() => {
    if (profileCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && profileCompleted) {
      router.push("/");
    }
  }, [countdown, profileCompleted, router]);

  const handleProfileComplete = async () => {
    try {
      await axios.post("/api/user/info", profileData);
      toast.success(" Profile completed!");
      setProfileCompleted(true);

      const me = await axios.get("/api/user/me");
      setUser(me.data.user);
    } catch (error: any) {
      console.error("❌ Profile save error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to complete profile. Try again.";
      toast.error(`❌ ${errorMessage}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col  bg-black">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-purple-950/70 "></div>
      {/* LOGO */}
      <div className="logo-container relative w-20 h-20 mt-6 ml-12">
        <div className="logo-bg absolute w-12 h-12 rounded-2xl bg-purple-600" />
        <div className="logo-text absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[32px] text-white tracking-tight">
          <h2> Whispr.</h2>
        </div>
      </div>
      {profileCompleted ? (
        <div className="max-w-md w-full mx-auto px-4 relative z-10">
          {/* Success icon + Main heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-5 mb-6"
          >
            <div className="">
              <h2 className="text-[28px] font-medium text-white mb-2 capitalize">
                Your profile is Completed
              </h2>
            </div>
            <div className="bg-purple-600 rounded-full p-2 -mt-1">
              <Check className="h-5 w-5 text-white" />
            </div>
          </motion.div>

          {/* second  heading */}
          <p className="text-gray-400 text-[16px] mb-5 text-center tracking-wide">
            Welcome to Whispr. We're excited to have you.
          </p>
          {/* User profile card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-gray-400/30 backdrop-blur-3xl border-zinc-800 mb-6 rounded-lg max-w-sm mx-auto">
              <div className="py-4">
                <div className="flex items-center justify-center gap-10 px-10">
                  <Image
                    src={user?.profilePic || "/default-avatar.png"}
                    alt="Profile Picture"
                    width={80}
                    height={80}
                    className="rounded-full border border-zinc-700"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-white font-medium text-[18px] tracking-wide capitalize">
                        {user?.username}
                      </h2>
                      <Badge className="bg-purple-600 text-xs font-normal text-white hover:bg-purple-700">
                        New
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-[15px] italic">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <p className="text-center mt-2 text-purple-200 text-[12px]">
                  wow ! Looking nice
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <h3 className="text-gray-400 text-xs uppercase font-medium tracking-wider mb-3">
              What's next {user?.username}
            </h3>
            <div className="space-y-3">
              {[
                "Whispr your thoughts—let the world hear what silence hides.",
                "Connect with like-minded people and start campaigns.",
                "Start conversations that matter—no identity, no fear, just truth.",
                "Dive into trending topics, drop your truth, and drive impact.",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-gray-300 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-600"></div>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-center text-gray-500 text-xs mt-4">
              You'll be automatically redirected in {countdown} seconds
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="z-50 w-full">
          <ProfileSetup onComplete={handleProfileComplete} />
        </div>
      )}
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
    </main>
  );
}
