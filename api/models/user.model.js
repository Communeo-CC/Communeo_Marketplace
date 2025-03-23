import mongoose from "mongoose";
import { Channel } from "./channel.model.js"; // Import the Channel model

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  desc: {
    type: String,
    required: false,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
  userrole: {
    type: String,
    enum: ["BusinessOwner", "Influencer", "Freelancer"],
    default: "Business Owner",
  },
  channelId: {
    type: String,
    required: function () {
      return this.userrole === "Influencer"; // Conditionally required
    },
  },
}, {
  timestamps: true,
});

// Post-save middleware to extract influencer details and save to Channel collection
userSchema.post('save', async function (doc) {
  if (doc.userrole === "Influencer" && doc.channelId) {
    try {
      // Extract influencer details from the User document
      const influencerDetails = {
        channelId: doc.channelId,
        userId: doc._id,
        username: doc.username,
        email: doc.email,
        userrole: doc.userrole,
      };

      // Save the details to the Channel collection
      const newChannel = new Channel(influencerDetails);
      await newChannel.save();

      console.log("Influencer details saved to Channel collection:", newChannel);
    } catch (error) {
      console.error("Error saving influencer details to Channel collection:", error.message);
    }
  }
});

export default mongoose.model("User", userSchema);