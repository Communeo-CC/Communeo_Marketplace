import mongoose from "mongoose";
const { Schema } = mongoose;

const videoSchema = new Schema({
  videoId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  channelTitle: {
    type: String,
    required: true,
  },
  statistics: {
    viewCount: String,
    likeCount: String,
    commentCount: String,
  },
  publishedAt: {
    type: Date,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export const Video = mongoose.model("Video", videoSchema); 