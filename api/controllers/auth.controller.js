import User from "../models/user.model.js";
import { Channel } from "../models/channel.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fetchChannelDetails } from "../utils/youtube.js";

export const register = async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 5);
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    const savedUser = await newUser.save();

    // If user is registering as an influencer and has provided a channel ID
    if (req.body.userrole === "Influencer" && req.body.channelId) {
      try {
        // Fetch fresh channel details from YouTube
        const channelDetails = await fetchChannelDetails(req.body.channelId, process.env.YOUTUBE_API_KEY);
        console.log('Fetched channel details:', channelDetails);
        
        // Create or update channel record
        const channelData = {
          channelId: req.body.channelId,
          userId: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          isRegistered: true,
          title: channelDetails.title,
          thumbnailUrl: channelDetails.thumbnailUrl,
          statistics: {
            subscriberCount: channelDetails.subscriberCount,
            videoCount: channelDetails.videoCount,
            viewCount: channelDetails.viewCount
          },
          registeredAt: new Date()
        };

        console.log('Saving channel data:', channelData);
        const savedChannel = await Channel.findOneAndUpdate(
          { channelId: req.body.channelId },
          channelData,
          { upsert: true, new: true }
        );
        console.log('Saved channel:', savedChannel);
      } catch (error) {
        console.error('Error updating channel during registration:', error);
        // Don't fail registration if channel update fails
      }
    }

    res.status(201).json("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_KEY
    );

    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(info);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};
