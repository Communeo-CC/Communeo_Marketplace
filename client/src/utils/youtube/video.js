import axios from 'axios';
import { YOUTUBE_API_BASE } from './constants';
import { extractVideoId } from './helpers';

export const fetchVideoStats = async (url, apiKey) => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  const response = await axios.get(
    `${YOUTUBE_API_BASE}/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`
  );

  if (!response.data.items?.length) {
    throw new Error('Video not found');
  }

  const video = response.data.items[0];
  const views = parseInt(video.statistics.viewCount);
  const likes = parseInt(video.statistics.likeCount || '0');
  const comments = parseInt(video.statistics.commentCount || '0');
  const engagementRate = ((likes + comments) / views) * 100;

  return {
    id: videoId,
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
    publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
    viewCount: video.statistics.viewCount,
    likeCount: video.statistics.likeCount || '0',
    commentCount: video.statistics.commentCount || '0',
    thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
    duration: video.contentDetails.duration,
    engagementRate,
    url
  };
};