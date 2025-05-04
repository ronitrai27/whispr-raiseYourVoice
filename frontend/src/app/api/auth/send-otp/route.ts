import { NextResponse } from 'next/server';
import { connectDB } from '@/config/dbConfig';
import { sendOTP } from '@/helpers/mailer';
import { OTP_RESEND_INTERVAL, getRemainingSeconds } from '@/lib/otpTimer';
import Redis from 'ioredis';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL!);

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Check Redis cooldown
    const lastSentTime = await redis.get(`cooldown:${email}`);
    if (lastSentTime) {
      const remaining = getRemainingSeconds(Number(lastSentTime));
      if (remaining > 0) {
        console.log(`🕒 Cooldown active for ${email}, ${remaining}s left`);
        return NextResponse.json({
          message: `Please wait ${remaining}s before resending OTP.`,
        }, { status: 429 });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via mail
    await sendOTP(email, otp);
    console.log(`📩 OTP sent to: ${email}`);
    console.log(`🔢 OTP Generated: ${otp}`);

    // Store OTP in Redis (expires in 5 min)
    await redis.set(`otp:${email}`, otp, 'EX', 300);

    // Debug log to confirm it's saved
    const redisStoredOtp = await redis.get(`otp:${email}`);
    console.log(`📦 OTP stored in Redis: ${redisStoredOtp}`);

    // Set cooldown (expires in 1 min)
    await redis.set(`cooldown:${email}`, Date.now().toString(), 'EX', OTP_RESEND_INTERVAL);

    return NextResponse.json({
      message: 'OTP sent successfully',
    }, { status: 200 });

  } catch (error) {
    console.error('❌ OTP send error:', error);
    return NextResponse.json({ message: 'Failed to send OTP' }, { status: 500 });
  }
}
