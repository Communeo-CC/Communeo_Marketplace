import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { fetchChannelDetails, fetchVideoStats } from '../../utils/youtube';

export function AdminPanel({ apiKey, onCreatorsChange, onVideosChange }) {
  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creators, setCreators] = useState([]);
  const [videos, setVideos] = useState([]);

  // Fetch initial data
  useEffect(() => {
    fetchCreators();
    fetchVideos();
  }, []);

  // Fetch creators from database
  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/creators');
      const data = await response.json();
      setCreators(data);
      onCreatorsChange(data);
    } catch (err) {
      console.error('Error fetching creators:', err);
    }
  };

  // Fetch videos from database
  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data);
      onVideosChange(data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const handleAddCreator = async () => {
    setError('');
    setLoading(true);

    try {
      if (!channelId.trim()) {
        throw new Error('Please enter a channel ID');
      }

      const creatorDetails = await fetchChannelDetails(channelId.trim(), apiKey);
      
      // Add creator to database
      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creatorDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add creator');
      }

      await fetchCreators(); // Refresh creators list
      setChannelId('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch channel details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    setError('');
    setLoading(true);

    try {
      if (!videoUrl.trim()) {
        throw new Error('Please enter a video URL');
      }

      const videoDetails = await fetchVideoStats(videoUrl.trim(), apiKey);
      
      // Add video to database
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add video');
      }

      await fetchVideos(); // Refresh videos list
      setVideoUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video statistics');
    } finally {
      setLoading(false);
    }
  };

  const removeCreator = async (id) => {
    try {
      await fetch(`/api/creators/${id}`, {
        method: 'DELETE',
      });
      await fetchCreators(); // Refresh creators list
    } catch (err) {
      console.error('Error removing creator:', err);
    }
  };

  const removeVideo = async (id) => {
    try {
      await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
      });
      await fetchVideos(); // Refresh videos list
    } catch (err) {
      console.error('Error removing video:', err);
    }
  };

  const syncCreatorsFromChannels = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/creators/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync creators');
      }

      await fetchCreators(); // Refresh creators list
    } catch (err) {
      setError('Failed to sync creators from channels');
      console.error('Error syncing creators:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <Tabs defaultValue="creators" className="tabs">
        <TabsList>
          <TabsTrigger value="creators">Manage Creators</TabsTrigger>
          <TabsTrigger value="videos">Manage Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="creators">
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
                  onClick={syncCreatorsFromChannels} 
                  disabled={loading}
                  variant="secondary"
                >
                  <RefreshCw className="btn-icon mr-2" />
                  {loading ? 'Syncing...' : 'Sync Registered Creators'}
                </Button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <p className="help-text">
                You can find a channel ID in the channel's URL after "/channel/" or in the channel's advanced settings.
              </p>
            </CardContent>
          </Card>

          <Card>
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
                          {creator.isRegistered && (
                            <span className="registered-badge">Registered</span>
                          )}
                        </h3>
                        <p className="item-subtitle">{creator.id}</p>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Add Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="add-form">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube video URL"
                />
                <Button onClick={handleAddVideo} disabled={loading}>
                  <Plus className="btn-icon" />
                  {loading ? 'Adding...' : 'Add Video'}
                </Button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Videos</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <h3 className="item-title">{video.title}</h3>
                        <p className="item-subtitle">{video.channelTitle}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {videos.length === 0 && (
                  <div className="empty-state">No videos added yet</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}