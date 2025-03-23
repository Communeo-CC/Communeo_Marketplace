import mongoose from "mongoose";
const { Schema } = mongoose;

const channelSchema = new Schema({
  channelId: {
    type: String,
    required: true,
    unique: true,
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
  title: {
    type: String,
    required: false,
  },
  thumbnailUrl: {
    type: String,
    required: false,
  },
  statistics: {
    subscriberCount: String,
    videoCount: String,
    viewCount: String,
  },
  isRegistered: {
    type: Boolean,
    default: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  userrole: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Channel = mongoose.model("Channel", channelSchema);