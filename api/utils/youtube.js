import axios from 'axios';

export const fetchChannelDetails = async (channelId, apiKey) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    );

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = response.data.items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnailUrl: channel.snippet.thumbnails.default.url,
      subscriberCount: channel.statistics.subscriberCount,
      videoCount: channel.statistics.videoCount,
      viewCount: channel.statistics.viewCount,
    };
  } catch (error) {
    console.error('Error fetching channel details:', error);
    throw error;
  }
};

export const fetchVideoStats = async (videoUrl, apiKey) => {
  try {
    // Extract video ID from URL
    const videoId = videoUrl.split('v=')[1]?.split('&')[0];
    if (!videoId) throw new Error('Invalid video URL');

    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
    );

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    const video = response.data.items[0];
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      publishedAt: video.snippet.publishedAt,
      statistics: {
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        commentCount: video.statistics.commentCount,
      },
    };
  } catch (error) {
    console.error('Error fetching video statistics:', error);
    throw error;
  }
}; 