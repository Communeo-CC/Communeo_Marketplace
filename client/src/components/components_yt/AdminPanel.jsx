import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, RefreshCw, Youtube, Video } from 'lucide-react';
import { fetchChannelDetails } from '../../utils/youtube';
import newRequest from '../../utils/newRequest';
import axios from 'axios';
import './AdminPanel.scss';

export function AdminPanel({ apiKey, onCreatorsChange }) {
  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [creators, setCreators] = useState([]);
  const [videos, setVideos] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchAllCreators();
    fetchAllVideos();
  }, []);

  // Fetch videos from database
  const fetchAllVideos = async () => {
    try {
      setVideoLoading(true);
      const response = await newRequest.get('/videos');
      const savedVideos = response.data;

      // Fetch fresh YouTube details for each video
      const videosWithDetails = await Promise.all(
        savedVideos.map(async (video) => {
          try {
            const youtubeDetails = await fetchVideoDetails(video.videoId);
            return {
              ...youtubeDetails,
              addedAt: video.addedAt || video.createdAt,
              _id: video._id
            };
          } catch (err) {
            console.error(`Error fetching details for video ${video.videoId}:`, err);
            return null;
          }
        })
      );

      // Filter out failed fetches
      const validVideos = videosWithDetails.filter(video => video !== null);
      setVideos(validVideos);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setVideoError('Failed to fetch videos');
    } finally {
      setVideoLoading(false);
    }
  };

  // Fetch both registered and unregistered creators
  const fetchAllCreators = async () => {
    try {
      setLoading(true);
      // Fetch registered creators from channels collection
      const registeredResponse = await newRequest.get('/channels');
      const registeredCreators = registeredResponse.data;

      // Fetch YouTube details for each creator
      const creatorsWithDetails = await Promise.all(
        registeredCreators.map(async (creator) => {
          try {
            const youtubeDetails = await fetchYouTubeDetails(creator.channelId);
            return {
              ...youtubeDetails,
              id: creator.channelId,
              isRegistered: true,
              email: creator.email || '',
              username: creator.username || '',
              userId: creator.userId || ''
            };
          } catch (err) {
            console.error(`Error fetching details for ${creator.channelId}:`, err);
            return null;
          }
        })
      );

      // Filter out any null results from failed fetches
      const validCreators = creatorsWithDetails.filter(creator => creator !== null);
      setCreators(validCreators);
      onCreatorsChange(validCreators);
    } catch (err) {
      console.error('Error fetching creators:', err);
      setError('Failed to fetch creators');
    } finally {
      setLoading(false);
    }
  };

  const fetchYouTubeDetails = async (channelId) => {
    try {
      if (!channelId || !channelId.startsWith('UC')) {
        throw new Error('Invalid channel ID format');
      }

      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
      const response = await axios.get(url);

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = response.data.items[0];
      return {
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnailUrl: channel.snippet.thumbnails.default.url,
        statistics: channel.statistics,
        channelId: channelId
      };
    } catch (err) {
      throw new Error(`Failed to fetch YouTube details: ${err.message}`);
    }
  };

  const handleAddCreator = async () => {
    setError('');
    setLoading(true);

    try {
      if (!channelId.trim()) {
        throw new Error('Please enter a channel ID');
      }

      const youtubeDetails = await fetchYouTubeDetails(channelId.trim());
      
      // Add to creators list
      const newCreator = {
        ...youtubeDetails,
        id: channelId.trim(),
        isRegistered: false
      };

      setCreators(prev => [...prev, newCreator]);
      onCreatorsChange([...creators, newCreator]);
      setChannelId('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeCreator = async (id) => {
    try {
      const creator = creators.find(c => c.id === id);
      if (!creator) return;

      if (creator.isRegistered) {
        setError('Cannot remove registered creators');
        return;
      }

      setCreators(prev => prev.filter(c => c.id !== id));
      onCreatorsChange(creators.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to remove creator');
      console.error('Error removing creator:', err);
    }
  };

  const extractVideoId = (url) => {
    try {
      // Handle different YouTube URL formats
      let videoId = null;
      
      // Regular YouTube watch URL
      if (url.includes('youtube.com/watch?v=')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      }
      // Shortened youtu.be URL
      else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      // Embed URL
      else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      // Direct video ID
      else if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
        videoId = url;
      }

      // Validate video ID format
      if (videoId && videoId.length === 11) {
        return videoId;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const fetchVideoDetails = async (videoId) => {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;
      const response = await axios.get(url);

      if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found');
      }

      const video = response.data.items[0];
      return {
        id: videoId,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
        thumbnailUrl: video.snippet.thumbnails.default.url,
        statistics: video.statistics,
        publishedAt: video.snippet.publishedAt
      };
    } catch (err) {
      throw new Error(`Failed to fetch video details: ${err.message}`);
    }
  };

  const handleAddVideo = async () => {
    setVideoError('');
    setVideoLoading(true);

    try {
      const input = videoUrl.trim();
      if (!input) {
        throw new Error('Please enter a video URL');
      }

      // Store the original URL
      const originalUrl = input;

      const videoId = extractVideoId(input);
      if (!videoId) {
        throw new Error('Invalid YouTube video URL. Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=..., https://youtu.be/...)');
      }

      const videoDetails = await fetchVideoDetails(videoId);
      
      // Save to database with original URL
      const response = await newRequest.post('/videos', {
        url: originalUrl, // Use the original URL
        videoId: videoId,
        title: videoDetails.title,
        channelId: videoDetails.channelId,
        channelTitle: videoDetails.channelTitle,
        thumbnailUrl: videoDetails.thumbnailUrl,
        statistics: videoDetails.statistics,
        publishedAt: videoDetails.publishedAt
      });

      // Add to videos list with database ID
      const newVideo = {
        ...videoDetails,
        url: originalUrl, // Include the original URL
        _id: response.data._id,
        addedAt: new Date().toISOString()
      };

      setVideos(prev => [newVideo, ...prev]);
      setVideoUrl('');
    } catch (err) {
      console.error('Error adding video:', err);
      setVideoError(err.response?.data?.message || err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const removeVideo = async (id) => {
    try {
      await newRequest.delete(`/videos/${id}`);
      setVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      setVideoError('Failed to remove video');
      console.error('Error removing video:', err);
    }
  };

  return (
    <div className="admin-panel">
      

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add Video for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="add-form">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL or ID (e.g., youtube.com/watch?v=... or youtu.be/...)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddVideo();
                }
              }}
            />
            <Button onClick={handleAddVideo} disabled={videoLoading}>
              <Plus className="btn-icon" />
              {videoLoading ? 'Adding...' : 'Add Video'}
            </Button>
            <Button 
              onClick={fetchAllVideos} 
              disabled={videoLoading}
              variant="secondary"
            >
              <RefreshCw className={`btn-icon mr-2 ${videoLoading ? 'animate-spin' : ''}`} />
              {videoLoading ? 'Refreshing...' : 'Refresh Videos'}
            </Button>
          </div>
          {videoError && <p className="error-message">{videoError}</p>}
          <p className="help-text">
            Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/..., or direct video ID
          </p>
          
          <div className="videos-list">
            {videoLoading && (
              <div className="loading-state">
                <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
                <p>Loading videos...</p>
              </div>
            )}
            {!videoLoading && videos.map((video) => (
              <div key={video._id} className="video-item">
                <div className="item-content">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <div className="item-info">
                    <h3 className="item-title">
                      {video.title}
                    </h3>
                    <p className="item-subtitle">
                      <Video className="inline-block w-4 h-4 mr-1" />
                      {video.channelTitle}
                    </p>
                    <p className="video-stats">
                      Views: {video.statistics.viewCount.toLocaleString()} • 
                      Likes: {video.statistics.likeCount?.toLocaleString() || 'N/A'} •
                      Added: {new Date(video.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVideo(video._id)}
                  title="Remove video"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {!videoLoading && videos.length === 0 && (
              <div className="empty-state">No videos added for analysis</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manage Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="creators-list">
            {creators.map((creator) => (
              <div key={creator.id} className="creator-item">
                <div className="item-content">
                  <img
                    src={creator.thumbnailUrl}
                    alt={creator.title}
                    className="creator-avatar"
                  />
                  <div className="item-info">
                    <h3 className="item-title">
                      {creator.title}
                      {creator.isRegistered ? (
                        <span className="registered-badge">Registered</span>
                      ) : (
                        <span className="unregistered-badge">Unregistered</span>
                      )}
                    </h3>
                    <p className="item-subtitle">
                      <Youtube className="inline-block w-4 h-4 mr-1" />
                      {creator.channelId}
                    </p>
                    {creator.isRegistered && (
                      <p className="creator-details">
                        {creator.username} • {creator.email}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCreator(creator.id)}
                  disabled={creator.isRegistered}
                  title={creator.isRegistered ? "Cannot delete registered creators" : "Delete creator"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {creators.length === 0 && (
              <div className="empty-state">No creators added yet</div>
            )}
            {loading && (
              <div className="loading-state">
                <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
                <p>Loading creators...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}