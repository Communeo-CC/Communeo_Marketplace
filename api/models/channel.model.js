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
  userrole: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Channel = mongoose.model("Channel", channelSchema);