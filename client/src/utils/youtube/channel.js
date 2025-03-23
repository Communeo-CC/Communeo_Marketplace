import axios from 'axios';
import { YOUTUBE_API_BASE } from './constants';

export const fetchChannelDetails = async (channelId, apiKey) => {
  const response = await axios.get(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
  );

  if (!response.data.items?.length) {
    throw new Error('Channel not found');
  }

  const channel = response.data.items[0];
  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnailUrl: channel.snippet.thumbnails.default.url,
    subscriberCount: channel.statistics.subscriberCount,
    viewCount: channel.statistics.viewCount,
    videoCount: channel.statistics.videoCount,
  };
};

export const fetchChannelVideos = async (channelId, apiKey) => {
  // First, get the channel's uploads playlist ID
  const channelResponse = await axios.get(
    `${YOUTUBE_API_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
  );

  if (!channelResponse.data.items?.length) {
    throw new Error('Channel not found');
  }

  const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

  // Get the latest 100 videos from the uploads playlist
  const playlistResponse = await axios.get(
    `${YOUTUBE_API_BASE}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=100&key=${apiKey}`
  );

  const videoIds = playlistResponse.data.items.map(item => item.snippet.resourceId.videoId).join(',');

  // Get detailed stats for all videos
  const videoStatsResponse = await axios.get(
    `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoIds}&key=${apiKey}`
  );

  return videoStatsResponse.data.items.map(video => {
    const views = parseInt(video.statistics.viewCount);
    const likes = parseInt(video.statistics.likeCount || '0');
    const comments = parseInt(video.statistics.commentCount || '0');
    const engagementRate = ((likes + comments) / views * 100);

    return {
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount || '0',
      commentCount: video.statistics.commentCount || '0',
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      engagementRate,
      publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
      channelTitle: video.snippet.channelTitle
    };
  });
};