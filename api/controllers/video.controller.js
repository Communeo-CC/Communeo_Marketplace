import { Video } from '../models/video.model.js';

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({});
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// Add a new video
export const addVideo = async (req, res) => {
  try {
    const existingVideo = await Video.findOne({ id: req.body.id });
    if (existingVideo) {
      return res.status(400).json({ message: 'Video already exists' });
    }

    const newVideo = new Video(req.body);
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Error adding video', error: error.message });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const result = await Video.findOneAndDelete({ id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message });
  }
}; 