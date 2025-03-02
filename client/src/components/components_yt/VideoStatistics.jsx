import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Eye, ThumbsUp, MessageCircle, Activity, ExternalLink, Youtube } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';
import { Button } from './ui/button';

export function VideoStatistics({ apiKey, videos = [], onVideosChange }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openYouTubeVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="video-statistics">
      <Card>
        <CardHeader>
          <CardTitle>Video List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="videos-list">
            {videos.map((video) => (
              <Card key={video.id} className="video-item">
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
                          {formatNumber(parseInt(video.viewCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <ThumbsUp className="stat-icon" />
                        <span className="stat-value">
                          {formatNumber(parseInt(video.likeCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <MessageCircle className="stat-icon" />
                        <span className="stat-value">
                          {formatNumber(parseInt(video.commentCount))}
                        </span>
                      </div>
                      <div className="stat-item">
                        <Activity className="stat-icon" />
                        <span className="stat-value">
                          {video.engagementRate.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="video-info">
                    <h3 className="video-title">{video.title}</h3>
                    <p className="video-meta">
                      {video.channelTitle} • {video.publishedAt}
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
                      onClick={() => openYouTubeVideo(video.id)}
                    >
                      <Youtube className="btn-icon" />
                      View Video
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {videos.length === 0 && (
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
                      by {selectedVideo.channelTitle} • Published on {selectedVideo.publishedAt}
                    </p>
                  </div>
                  <Button 
                    onClick={() => openYouTubeVideo(selectedVideo.id)}
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
                    {formatNumber(parseInt(selectedVideo.viewCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Likes</h3>
                  <p className="stat-value">
                    {formatNumber(parseInt(selectedVideo.likeCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Comments</h3>
                  <p className="stat-value">
                    {formatNumber(parseInt(selectedVideo.commentCount))}
                  </p>
                </div>
                <div className="stat-item">
                  <h3 className="stat-label">Engagement Rate</h3>
                  <p className="stat-value">
                    {selectedVideo.engagementRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="video-description">
                <h3 className="description-title">Description</h3>
                <div className="description-content">
                  <p>{selectedVideo.description}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}