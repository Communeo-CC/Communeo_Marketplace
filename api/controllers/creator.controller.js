import { Creator } from '../models/creator.model.js';
import { Channel } from '../models/channel.model.js';
import { fetchChannelDetails } from '../utils/youtube.js';

// Get all creators
export const getAllCreators = async (req, res) => {
  try {
    const creators = await Creator.find({});
    res.status(200).json(creators);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching creators', error: error.message });
  }
};

// Add a new creator
export const addCreator = async (req, res) => {
  try {
    const existingCreator = await Creator.findOne({ id: req.body.id });
    if (existingCreator) {
      return res.status(400).json({ message: 'Creator already exists' });
    }

    const newCreator = new Creator(req.body);
    await newCreator.save();
    res.status(201).json(newCreator);
  } catch (error) {
    res.status(500).json({ message: 'Error adding creator', error: error.message });
  }
};

// Delete a creator
export const deleteCreator = async (req, res) => {
  try {
    const result = await Creator.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'Creator not found' });
    }
    res.status(200).json({ message: 'Creator deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting creator', error: error.message });
  }
};

// Add creator from registration
export const addCreatorFromRegistration = async (userData, channelId, apiKey) => {
  try {
    // Check if creator already exists
    const existingCreator = await Creator.findOne({ id: channelId });
    if (existingCreator) {
      // Update existing creator with registration info
      existingCreator.userId = userData._id;
      existingCreator.username = userData.username;
      existingCreator.email = userData.email;
      existingCreator.isRegistered = true;
      existingCreator.registeredAt = new Date();
      await existingCreator.save();
      return existingCreator;
    }

    // Fetch channel details from YouTube
    const channelDetails = await fetchChannelDetails(channelId, apiKey);

    // Create new creator with user data
    const newCreator = new Creator({
      ...channelDetails,
      userId: userData._id,
      username: userData.username,
      email: userData.email,
      isRegistered: true,
    });

    await newCreator.save();
    return newCreator;
  } catch (error) {
    console.error('Error adding creator from registration:', error);
    throw error;
  }
};

// Sync creators from channels
export const syncCreatorsFromChannels = async (apiKey) => {
  try {
    // Get all channels
    const channels = await Channel.find({});
    
    for (const channel of channels) {
      try {
        // Check if creator already exists
        const existingCreator = await Creator.findOne({ id: channel.channelId });
        if (existingCreator) continue;

        // Fetch channel details from YouTube
        const channelDetails = await fetchChannelDetails(channel.channelId, apiKey);

        // Create new creator
        const newCreator = new Creator({
          ...channelDetails,
          userId: channel.userId,
          username: channel.username,
          email: channel.email,
          isRegistered: true,
        });

        await newCreator.save();
      } catch (err) {
        console.error(`Error syncing channel ${channel.channelId}:`, err);
      }
    }
  } catch (error) {
    console.error('Error syncing creators from channels:', error);
    throw error;
  }
}; 