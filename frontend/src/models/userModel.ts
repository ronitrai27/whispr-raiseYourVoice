import mongoose, { Schema, Document, Model } from "mongoose";

// TypeScript interface
export interface IUser extends Document {
  username: string;
  email: string;
  publicId: string; 
  gender: "male" | "female" | "other";
  age: number;
  profilePic: string;
  likes: number;
  followers: mongoose.Types.ObjectId[];
  followed: mongoose.Types.ObjectId[];
  totalComments: number;
  bookmarked: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    followers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    followed: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    bookmarked: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Export model using mongoose.models for ESM compatibility
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);