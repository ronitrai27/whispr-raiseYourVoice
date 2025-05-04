"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useProfile } from "@/context/ProfileContext";
type LoginFormData = z.infer<typeof loginSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setEmail } = useProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    let loadingToast: string;

    try {
      // First, validate the form data using Zod
      const validationResult = await loginSchema.safeParseAsync(data);

      if (!validationResult.success) {
        toast.error(validationResult.error.errors[0].message);
        return;
      }

      loadingToast = toast.loading("Sending OTP...");

      const res = await axios.post("/api/auth/send-otp", {
        email: data.email,
      });

      if (res.status === 200) {
        toast.success("OTP sent successfully!");
        setEmail(data.email!);
        router.push(`/authentication/${data.email}`);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }
    }
  };

  return (
    <div className="h-screen bg-black flex justify-center items-center overflow-hidden relative">
      {/* Background grid pattern */}
      <div className="bg-grid absolute inset-0 z-0" />
      {/* Background purple gradient */}
      <div className="bg-gradient absolute top-[-50%] left-[-20%] w-[140%] h-[200%] z-0" />

      <main className="z-50 border-[1px] border-[#e7e7e731] bg-slate-300/30 backdrop-blur-3xl rounded-md shadow-lg shadow-purple-500/20 p-4">
        <div className="logo-container relative w-20 h-20 mt-2 mx-auto">
          <div className="logo-bg absolute w-12 h-12 rounded-2xl bg-accent" />
          <div className="logo-text absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-medium text-[32px] text-black tracking-tight">
            <h2> Whispr.</h2>
          </div>
        </div>
        <h3 className="text-[22px] font-medium text-white/40 tracking-wide text-center">
          &quot;Rise Unseen, Roar Unheard.&quot;
        </h3>
        <p className="text-center text-[16px] font-medium text-white/80 tracking-tight">
          Where Voices Unseen, Impact Unstoppable. Lets Get{" "}
          <span>connected</span>
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 mt-10 max-w-md mx-auto"
        >
          <div className="relative">
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-lg border-2 border-purple-300 bg-white/10 backdrop-blur-sm text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              placeholder="✨ your.email@example.com"
            />
            {errors.email && (
              <p className=" text-pink-400 text-xs font-medium mt-2 animate-bounce">
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Lets connect
              </>
            )}
          </button>
        </form>
        <div className="flex  justify-between mx-10 items-center">
          <h2 className="text-center text-purple-200 text-[12px] ">
            We&apos;ll send a magic code to your email ✨
          </h2>
          <Image src="/family.png" alt="Logo" width={90} height={90} />
        </div>
      </main>
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
