import { NextResponse } from 'next/server';
import { connectDB } from '@/config/dbConfig';
import Redis from 'ioredis';
import { z } from 'zod';
import { User } from '@/models/userModel';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
// Redis client setup
const redis = new Redis(process.env.REDIS_URL!);
const JWT_SECRET = process.env.JWT_SECRET as string;
const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, otp } = await req.json();
    const cookieStore = await cookies();

    console.log("📩 Incoming Email:", email);
    console.log("🔢 Incoming OTP:", otp);

    otpSchema.parse({ otp });

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
    }

    const storedOtp = await redis.get(`otp:${email}`);
    console.log("📦 Stored OTP from Redis:", storedOtp);

    if (!storedOtp) {
      return NextResponse.json({ message: 'OTP has expired or is invalid.' }, { status: 400 });
    }

    if (storedOtp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
    }

    //MEANS OTP IS VALID 
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // ✅ Set JWT token for existing users
      const token = jwt.sign(
        { userId: existingUser._id, email: existingUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
    
      cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    } else {
      // ✅ Set temp_email for new users
      cookieStore.set("temp_email", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60, // 5 minutes
        path: "/",
      });
    }


    await redis.del(`otp:${email}`);

    return NextResponse.json({
      message: '✅ OTP verified successfully!',
      newUser: !existingUser,
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error during OTP verification:', error);
    return NextResponse.json({ message: 'Failed to verify OTP' }, { status: 500 });
  }
}
