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
  }, []);

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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
      if (!videoUrl.trim()) {
        throw new Error('Please enter a video URL');
      }

      const videoId = extractVideoId(videoUrl.trim());
      if (!videoId) {
        throw new Error('Invalid YouTube video URL');
      }

      const videoDetails = await fetchVideoDetails(videoId);
      
      // Add to videos list
      const newVideo = {
        ...videoDetails,
        addedAt: new Date().toISOString()
      };

      setVideos(prev => [...prev, newVideo]);
      setVideoUrl('');
    } catch (err) {
      setVideoError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const removeVideo = (id) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="admin-panel">
      <Card>
        <CardHeader>
          <CardTitle>Add Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="add-form">
            <Input
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              placeholder="Enter YouTube channel ID (e.g., UC...)"
            />
            <Button onClick={handleAddCreator} disabled={loading}>
              <Plus className="btn-icon" />
              {loading ? 'Adding...' : 'Add Creator'}
            </Button>
            <Button 
              onClick={fetchAllCreators} 
              disabled={loading}
              variant="secondary"
            >
              <RefreshCw className={`btn-icon mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Creators'}
            </Button>
          </div>
          {error && <p className="error-message">{error}</p>}
          <p className="help-text">
            You can find a channel ID in the channel's URL after "/channel/" or in the channel's advanced settings.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add Video for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="add-form">
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube video URL"
            />
            <Button onClick={handleAddVideo} disabled={videoLoading}>
              <Plus className="btn-icon" />
              {videoLoading ? 'Adding...' : 'Add Video'}
            </Button>
          </div>
          {videoError && <p className="error-message">{videoError}</p>}
          <p className="help-text">
            Paste the full YouTube video URL to analyze its performance metrics.
          </p>
          
          <div className="videos-list">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
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
                      Views: {video.statistics.viewCount} • Added: {new Date(video.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeVideo(video.id)}
                  title="Remove video"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {videos.length === 0 && (
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