// models/Campaign.js
import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    topicTags: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isGlobal: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", campaignSchema);
