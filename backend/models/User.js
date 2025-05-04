const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

// User Schema
const UserSchema = new Schema(
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
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followed: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export model
const User = models.User || model("User", UserSchema);
module.exports = User;
