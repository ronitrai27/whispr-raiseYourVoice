// /app/api/user/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/helpers/jwt"; // jwt helper
import redis from "@/helpers/redis"; // redis setup
import {connectDB} from "@/config/dbConfig"; 
import {User} from "@/models/userModel"; 

export async function GET(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = verifyToken(token);

    // Check Redis cache
    const cachedUser = await redis.get(`user:${userId}`);
    if (cachedUser) {
      return NextResponse.json({ user: JSON.parse(cachedUser) });
    }

    // Fetch from DB
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userObj = user.toObject();

    // Cache to Redis
    await redis.set(`user:${userId}`, JSON.stringify(userObj), "EX", 3600); // 1 hour

    return NextResponse.json({ user: userObj });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
