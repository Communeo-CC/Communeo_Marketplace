import { Channel } from '../models/channel.model.js';

// Get all channels
export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find({});
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channels', error: error.message });
  }
};

// Get channel by ID
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findOne({ channelId: req.params.channelId });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching channel', error: error.message });
  }
}; 