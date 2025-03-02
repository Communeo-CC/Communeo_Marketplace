import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Trash2 } from 'lucide-react';
import { fetchChannelDetails, fetchVideoStats } from '../../utils/youtube';

export function AdminPanel({ apiKey, onCreatorsChange, onVideosChange }) {
  const [channelId, setChannelId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCreator = async () => {
    setError('');
    setLoading(true);

    try {
      if (!channelId.trim()) {
        throw new Error('Please enter a channel ID');
      }

      const creatorDetails = await fetchChannelDetails(channelId.trim(), apiKey);
      
      const savedCreators = JSON.parse(localStorage.getItem('youtubeCreators') || '[]');
      if (savedCreators.some((creator) => creator.id === creatorDetails.id)) {
        throw new Error('Creator already exists');
      }
      
      const updatedCreators = [...savedCreators, creatorDetails];
      localStorage.setItem('youtubeCreators', JSON.stringify(updatedCreators));
      onCreatorsChange(updatedCreators);
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

      const newVideo = await fetchVideoStats(videoUrl.trim(), apiKey);
      const savedVideos = JSON.parse(localStorage.getItem('youtubeVideos') || '[]');
      
      if (savedVideos.some((video) => video.id === newVideo.id)) {
        throw new Error('Video already exists');
      }
      
      const updatedVideos = [...savedVideos, newVideo];
      localStorage.setItem('youtubeVideos', JSON.stringify(updatedVideos));
      onVideosChange(updatedVideos);
      setVideoUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video statistics');
    } finally {
      setLoading(false);
    }
  };

  const removeCreator = (id) => {
    const savedCreators = JSON.parse(localStorage.getItem('youtubeCreators') || '[]');
    const updatedCreators = savedCreators.filter((creator) => creator.id !== id);
    localStorage.setItem('youtubeCreators', JSON.stringify(updatedCreators));
    onCreatorsChange(updatedCreators);
  };

  const removeVideo = (id) => {
    const savedVideos = JSON.parse(localStorage.getItem('youtubeVideos') || '[]');
    const updatedVideos = savedVideos.filter((video) => video.id !== id);
    localStorage.setItem('youtubeVideos', JSON.stringify(updatedVideos));
    onVideosChange(updatedVideos);
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
                {JSON.parse(localStorage.getItem('youtubeCreators') || '[]').map((creator) => (
                  <div key={creator.id} className="creator-item">
                    <div className="item-content">
                      <img
                        src={creator.thumbnailUrl}
                        alt={creator.title}
                        className="creator-avatar"
                      />
                      <div className="item-info">
                        <h3 className="item-title">{creator.title}</h3>
                        <p className="item-subtitle">{creator.id}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCreator(creator.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {JSON.parse(localStorage.getItem('youtubeCreators') || '[]').length === 0 && (
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
                {JSON.parse(localStorage.getItem('youtubeVideos') || '[]').map((video) => (
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
                {JSON.parse(localStorage.getItem('youtubeVideos') || '[]').length === 0 && (
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