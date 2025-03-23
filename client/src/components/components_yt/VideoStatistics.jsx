import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Eye, ThumbsUp, MessageCircle, Activity, ExternalLink, Youtube } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';
import { Button } from './ui/button';
import newRequest from '../../utils/newRequest';

export function VideoStatistics({ apiKey }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await newRequest.get('/videos');
      setVideos(response.data);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const openYouTubeVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  // Calculate engagement rate
  const calculateEngagementRate = (video) => {
    const views = parseInt(video.statistics.viewCount) || 0;
    const likes = parseInt(video.statistics.likeCount) || 0;
    const comments = parseInt(video.statistics.commentCount) || 0;
    
    if (views === 0) return 0;
    return ((likes + comments) / views) * 100;
  };

  return (
    <div className="video-statistics">
      <Card>
        <CardHeader>
          <CardTitle>Video List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="loading-state">
              Loading videos...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="videos-list">
            {!loading && videos.map((video) => (
              <Card key={video._id} className="video-item">
                <CardContent className="video-content">
                  <div className="video-thumbnail-container">
                    <div className="video-thumbnail">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                      />
                    </div>
                    <div className="video-stats-grid">
                      <div className="stat-item">
                        <Eye className="stat-icon" />
                        <span className="stat-value">
                          {formatNumber(parseInt(video.statistics.viewCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <ThumbsUp className="stat-icon" />
                        <span className="stat-value">
                          {formatNumber(parseInt(video.statistics.likeCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <MessageCircle className="stat-icon" />
                        <span className="stat-value">
                          {formatNumber(parseInt(video.statistics.commentCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <Activity className="stat-icon" />
                        <span className="stat-value">
                          {calculateEngagementRate(video).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-meta">
                      {video.channelTitle} • {new Date(video.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="video-actions">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <ExternalLink className="btn-icon" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openYouTubeVideo(video.videoId)}
                    >
                      <Youtube className="btn-icon" />
                      View Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {!loading && videos.length === 0 && (
              <div className="empty-state">
                No videos added yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="dialog-content-large">
          <DialogHeader>
            <DialogTitle>Video Analysis</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <div className="video-analysis">
              <div className="video-header">
                <div className="video-thumbnail">
                  <img
                    src={selectedVideo.thumbnailUrl}
                    alt={selectedVideo.title}
                  />
                </div>
                <div className="video-info">
                  <div className="video-title-container">
                    <h2 className="video-title">{selectedVideo.title}</h2>
                    <p className="video-date">
                      by {selectedVideo.channelTitle} • Published on {new Date(selectedVideo.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => openYouTubeVideo(selectedVideo.videoId)}
                  >
                    <Youtube className="btn-icon" />
                    View Video
                  </Button>
                </div>
              </div>

              <div className="video-stats">
                <div className="stat-item">
                  <h3 className="stat-label">Views</h3>
                  <p className="stat-value">
                    {formatNumber(parseInt(selectedVideo.statistics.viewCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Likes</h3>
                  <p className="stat-value">
                    {formatNumber(parseInt(selectedVideo.statistics.likeCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Comments</h3>
                  <p className="stat-value">
                    {formatNumber(parseInt(selectedVideo.statistics.commentCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Engagement Rate</h3>
                  <p className="stat-value">
                    {calculateEngagementRate(selectedVideo).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="video-description">
                <h3 className="description-title">Description</h3>
                <div className="description-content">
                  <p>{selectedVideo.description || 'No description available.'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}