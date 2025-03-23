import mongoose from "mongoose";
const { Schema } = mongoose;

const creatorSchema = new Schema({
  id: {
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
  statistics: {
    subscriberCount: String,
    videoCount: String,
    viewCount: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isRegistered: {
    type: Boolean,
    default: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true,
});

export const Creator = mongoose.model("Creator", creatorSchema); 