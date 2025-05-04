import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/userModel";
import { connectDB } from "@/config/dbConfig";
import jwt from "jsonwebtoken";
import { generatePublicId } from "@/helpers/publicId";
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
  await connectDB();

  const cookieStore = req.cookies;
  const tempEmail = cookieStore.get("temp_email")?.value;

  if (!tempEmail) {
    return NextResponse.json({ message: " Unauthorized" }, { status: 401 });
  }

  const { username, gender, age, profilePic } = await req.json();

  if (!username || !gender || !age || !profilePic) {
    return NextResponse.json({ message: "❌ Missing fields" }, { status: 400 });
  }

  try {
    const existingUser = await User.findOne({ email: tempEmail });
    if (existingUser) {
      return NextResponse.json({ message: "❌ User already exists" }, { status: 400 });
    }
    //CREATING PUBLICID---------
    const publicId = await generatePublicId(username);

    const newUser = await User.create({
      email: tempEmail,
      username,
      gender,
      age,
      profilePic,
      publicId,
    });

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ JWT Auth Token , User logged In:", token);

    const response = NextResponse.json({
      message: "✅ Profile setup complete",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

    // Set auth_token cookie
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // Delete temp_email cookie
    response.cookies.set("temp_email", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Error saving user info:", error);
    return NextResponse.json(
      { message: "❌ Server error", error },
      { status: 500 }
    );
  }
}
