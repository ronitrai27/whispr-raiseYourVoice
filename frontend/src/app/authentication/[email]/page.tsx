"use client";
import { useState, useEffect, useRef } from "react";
import { useProfile } from "@/context/ProfileContext";
import { useAppContext } from "@/context/AppContext";
import { OTP_RESEND_INTERVAL } from "@/lib/otpTimer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { otpSchema } from "@/schemas/otpSchema";
import z from "zod";
import Image from "next/image";
import { Loader } from "lucide-react";
export default function AuthenticationPage() {
  const { email } = useProfile();
  const { setUser } = useAppContext();
  const [timer, setTimer] = useState<number>(OTP_RESEND_INTERVAL);
  const [resending, setResending] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useState(false);
  // Timer Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    if (!email) return;
    try {
      setResending(true);
      const res = await axios.post("/api/auth/send-otp", { email });
      if (res.status === 200) {
        toast.success("OTP resent!");
        setTimer(OTP_RESEND_INTERVAL);
      }
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  // WHEN USER PRESS BUTTON TO VERIFY OTP --------------------
  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    try {
      otpSchema.parse(enteredOtp);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return;
    }

    try {
      setVerifying(true);
      const res = await axios.post("/api/auth/loggedIn", {
        email,
        otp: enteredOtp,
      });
      if (res.status === 200) {
        toast.success("OTP verified successfully!");
        setOtpVerified(true);
        if (res.data.newUser) {
          router.push("/user-profile");
        } else {
          const me = await axios.get("/api/user/me");
          setUser(me.data.user);
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error: any) {
      toast.error("Error verifying OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="h-screen bg-black/30 flex justify-center items-center relative">
      {/* Background Grid */}
      <div className="bg-grid absolute inset-0 z-0" />
      {/* Background Gradient */}
      <div className="bg-gradient absolute top-[-50%] left-[-20%] w-[140%] h-[200%] z-0" />
      <main className="z-50">
        {/* Logo */}
        <div className="logo-container relative w-20 h-20 mt-2 mx-auto">
          <div className="logo-bg absolute w-12 h-12 rounded-2xl bg-slate-200" />
          <div className="logo-text absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[32px] text-black tracking-tight">
            <h2>Whispr.</h2>
          </div>
        </div>

        {/* OTP Sent Message */}
        <p className="font-[400] text-[16px] tracking-tight text-gray-600">
          We sent an OTP to: <span className="text-black ">{email}</span>
        </p>

        {/* OTP Input Fields */}
        <div className="flex justify-center space-x-2 mt-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              className="w-12 h-12 text-center border-2 border-black rounded-lg"
            />
          ))}
        </div>

        {/* OTP Verification Button */}
        <button
          onClick={handleSubmit}
          disabled={verifying || otpVerified}
          className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg disabled:bg-purple-500 cursor-pointer hover:bg-purple-700 flex items-center justify-center gap-2"
        >
          {otpVerified ? (
            "Redirecting..."
          ) : verifying ? (
            <>
              Verifying
              <Loader className="animate-spin h-5 w-5" />
            </>
          ) : (
            "Verify OTP"
          )}
        </button>

        {/* Resend OTP Button */}
        {timer > 0 ? (
          <p className="mt-4">Resend OTP in {timer}s</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
          >
            {resending ? "Resending..." : "Resend OTP"}
          </button>
        )}
        <p className="text-[14px] font-light italic text-center text-gray-700 mt-5">
          your safety is our priority !
        </p>
      </main>
      <div className="absolute bottom-6 right-0 ">
        <Image src="/reading.png" alt="Logo" width={180} height={180} />
      </div>
      <style jsx global>{`
        .bg-grid {
          background-image: linear-gradient(
              rgba(138, 43, 226, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(138, 43, 226, 0.05) 1px,
              transparent 1px
            );
          background-size: 25px 25px;
        }

        .bg-gradient {
          background: radial-gradient(
            circle,
            rgba(138, 43, 226, 0.3) 0%,
            rgba(0, 0, 0, 0) 70%
          );
          animation: pulse-bg 15s infinite alternate;
        }

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
