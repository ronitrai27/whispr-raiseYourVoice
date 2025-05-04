import { NextResponse } from "next/server";
import { connectDB } from "@/config/dbConfig";
import { User } from "@/models/userModel";

export async function POST(req: Request) {
  await connectDB();

  const { username } = await req.json();

  if (!username) {
    return NextResponse.json({ available: false, message: "Username required" }, { status: 400 });
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return NextResponse.json({ available: false });
  } else {
    return NextResponse.json({ available: true });
  }
}
