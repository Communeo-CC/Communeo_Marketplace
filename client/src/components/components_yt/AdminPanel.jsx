import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2, RefreshCw, Youtube } from 'lucide-react';
import { fetchChannelDetails, fetchVideoStats } from '../../utils/youtube';
import newRequest from '../../utils/newRequest';
import { formatNumber } from '../../utils/formatNumber';

export function AdminPanel({ apiKey, onCreatorsChange, onVideosChange }) {
  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creators, setCreators] = useState([]);
  const [videos, setVideos] = useState([]);
  const [manualChannelId, setManualChannelId] = useState('');
  const [manualChannelTitle, setManualChannelTitle] = useState('');

  // Fetch initial data
  useEffect(() => {
    loadCreators();
    loadVideos();
  }, []);

  // Load creators from database
  const loadCreators = async () => {
    try {
      const response = await newRequest.get('/channels');
      const channels = response.data;
      console.log('Loaded channels:', channels);
      
      // Fetch YouTube details for each channel
      const creatorPromises = channels.map(async (channel) => {
        try {
          const youtubeDetails = await fetchChannelDetails(channel.channelId, apiKey);
          return {
            ...youtubeDetails,
            id: channel.channelId,
            isRegistered: channel.isRegistered || false,
            email: channel.email || '',
            username: channel.username || '',
            userId: channel.userId || '',
            statistics: youtubeDetails.statistics
          };
        } catch (err) {
          console.error('Error fetching YouTube details:', err);
          return null;
        }
      });

      const creatorDetails = (await Promise.all(creatorPromises)).filter(creator => creator !== null);
      setCreators(creatorDetails);
      onCreatorsChange(creatorDetails);
    } catch (err) {
      console.error('Error loading creators:', err);
      setError('Failed to load creators');
    }
  };

  // Load videos from database
  const loadVideos = async () => {
    try {
      const response = await newRequest.get('/videos');
      const data = response.data;
      setVideos(data);
      onVideosChange(data);
    } catch (err) {
      console.error('Error loading videos:', err);
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
      await newRequest.post('/channels', {
        channelId: channelId.trim(),
        isRegistered: true,
        ...creatorDetails
      });

      await loadCreators(); // Refresh creators list
      setChannelId('');
    } catch (err) {
      console.error('Error adding creator:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add creator');
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualCreator = async () => {
    setError('');
    setLoading(true);

    try {
      if (!manualChannelId.trim()) {
        throw new Error('Please enter a channel ID');
      }

      // Fetch channel details from YouTube
      const channelDetails = await fetchChannelDetails(manualChannelId.trim(), apiKey);
      
      // Add unregistered creator to database
      await newRequest.post('/channels', {
        channelId: manualChannelId.trim(),
        title: channelDetails.title,
        thumbnailUrl: channelDetails.thumbnailUrl,
        isRegistered: false,
        statistics: channelDetails.statistics
      });

      await loadCreators(); // Refresh creators list
      setManualChannelId('');
    } catch (err) {
      console.error('Error adding manual creator:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add manual creator');
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
      
      await newRequest.post('/videos', videoDetails);

      await loadVideos(); // Refresh videos list
      setVideoUrl('');
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  const removeCreator = async (id) => {
    try {
      await newRequest.delete(`/channels/${id}`);
      await loadCreators(); // Refresh creators list
    } catch (err) {
      console.error('Error removing creator:', err);
      setError('Failed to remove creator');
    }
  };

  const removeVideo = async (id) => {
    try {
      await newRequest.delete(`/videos/${id}`);
      await loadVideos(); // Refresh videos list
    } catch (err) {
      console.error('Error removing video:', err);
      setError('Failed to remove video');
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
              <CardTitle>Add Registered Creator</CardTitle>
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
              </div>
              <p className="help-text">
                You can find a channel ID in the channel's URL after "/channel/" or in the channel's advanced settings.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add Unregistered Creator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="add-form">
                <Input
                  value={manualChannelId}
                  onChange={(e) => setManualChannelId(e.target.value)}
                  placeholder="Enter YouTube channel ID"
                  className="mb-2"
                />
                <Button onClick={handleAddManualCreator} disabled={loading}>
                  <Plus className="btn-icon" />
                  {loading ? 'Adding...' : 'Add Manual Creator'}
                </Button>
              </div>
              <p className="help-text">
                You can find a channel ID in the channel's URL after "/channel/" or in the channel's advanced settings.
              </p>
            </CardContent>
          </Card>

          {error && <p className="error-message mt-4">{error}</p>}

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Manage Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="creators-list">
                {creators.map((creator) => (
                  <div key={creator.id} className="creator-item">
                    <div className="item-content">
                      <img
                        src={creator.thumbnailUrl || 'default-avatar.png'}
                        alt={creator.title}
                        className="creator-avatar"
                      />
                      <div className="item-info">
                        <h3 className="item-title">
                          {creator.title}
                          <span className={`status-badge ${creator.isRegistered ? 'registered' : 'unregistered'}`}>
                            {creator.isRegistered ? 'Registered' : 'Unregistered'}
                          </span>
                        </h3>
                        <p className="item-subtitle">{creator.id}</p>
                        {creator.isRegistered && (
                          <div className="creator-details">
                            <p>{creator.username} • {creator.email}</p>
                            <p>Subscribers: {formatNumber(parseInt(creator.statistics?.subscriberCount || 0))}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="creator-actions">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://youtube.com/channel/${creator.id}`, '_blank')}
                      >
                        <Youtube className="w-4 h-4" />
                      </Button>
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