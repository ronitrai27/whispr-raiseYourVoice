const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Comment Schema
const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    topics: {
      type: [String],
      default: [],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    likeCount: {
      type: Number,
      default: 0,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reply",
      },
    ],
    viewedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    public: {
      type: Boolean,
      default: true, // Public by default
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
CommentSchema.index({ user: 1 });
CommentSchema.index({ createdAt: -1 });
CommentSchema.index({ topics: 1 });

// Pre-save hook to update counts
CommentSchema.pre("save", function (next) {
  this.likeCount = this.likes.length;
  this.viewCount = this.viewedBy.length;
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
