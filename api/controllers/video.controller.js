import { Video } from '../models/video.model.js';

// Get all videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ addedAt: -1 })
      .lean();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// Add a new video
export const addVideo = async (req, res) => {
  try {
    const { 
      videoId, 
      title, 
      channelId, 
      channelTitle, 
      thumbnailUrl, 
      statistics, 
      publishedAt,
      url 
    } = req.body;

    // Clean the URL
    const cleanUrl = url.trim();

    // Check for existing video first using URL
    const existingVideo = await Video.findOne({ url: cleanUrl });
    if (existingVideo) {
      return res.status(400).json({
        message: 'Video already exists',
        video: existingVideo
      });
    }

    // Process statistics
    const processedStats = {
      viewCount: parseInt(statistics.viewCount) || 0,
      likeCount: parseInt(statistics.likeCount) || 0,
      commentCount: parseInt(statistics.commentCount) || 0
    };

    // Calculate engagement rate
    const engagementRate = processedStats.viewCount > 0
      ? ((processedStats.likeCount + processedStats.commentCount) / processedStats.viewCount) * 100
      : 0;

    // Create new video document
    const newVideo = new Video({
      url: cleanUrl,
      videoId: videoId.trim(),
      title: title.trim(),
      channelId: channelId.trim(),
      channelTitle: channelTitle.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      statistics: {
        ...processedStats,
        engagementRate
      },
      publishedAt: new Date(publishedAt),
      addedAt: new Date()
    });

    // Save to database
    const savedVideo = await newVideo.save();
    res.status(201).json(savedVideo);
  } catch (error) {
    console.error('Error in addVideo:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Video already exists',
        error: 'A video with this URL already exists in the database'
      });
    }

    res.status(500).json({ 
      message: 'Error adding video', 
      error: error.message 
    });
  }
};

// Delete a video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        message: 'Video ID is required' 
      });
    }

    const deletedVideo = await Video.findByIdAndDelete(id);
    
    if (!deletedVideo) {
      return res.status(404).json({ 
        message: 'Video not found' 
      });
    }

    res.status(200).json({
      message: 'Video deleted successfully',
      video: {
        url: deletedVideo.url,
        title: deletedVideo.title
      }
    });
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({ 
      message: 'Error deleting video', 
      error: error.message 
    });
  }
}; 