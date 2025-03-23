import { Video } from '../models/video.model.js';

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ addedAt: -1 }); // Sort by most recently added
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// Add a new video
export const addVideo = async (req, res) => {
  try {
    const { videoId, title, channelId, channelTitle, thumbnailUrl, statistics, publishedAt } = req.body;

    // Validate required fields
    if (!videoId || !title || !channelId || !channelTitle || !thumbnailUrl || !publishedAt) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if video already exists
    const existingVideo = await Video.findOne({ videoId });
    if (existingVideo) {
      return res.status(400).json({ message: 'Video already exists' });
    }

    const newVideo = new Video({
      videoId,
      title,
      channelId,
      channelTitle,
      thumbnailUrl,
      statistics,
      publishedAt,
      addedAt: new Date()
    });

    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video', error: error.message });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const result = await Video.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message });
  }
}; 