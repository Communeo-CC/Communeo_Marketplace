import mongoose from "mongoose";
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
    default:false
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
},{
  timestamps:true
});

export default mongoose.model("User", userSchema)