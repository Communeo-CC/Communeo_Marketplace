import { formatNumber } from '../../utils/formatNumber';
import { Button } from './ui/button';
import { Youtube } from 'lucide-react';

export function VideoAnalysis({ video }) {
  const openYouTubeVideo = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="video-analysis">
      {/* Video Header */}
      <div className="video-header">
        <div className="video-thumbnail">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
          />
        </div>
        <div className="video-info">
          <div className="video-title-container">
            <h2 className="video-title">{video.title}</h2>
            <p className="video-date">
              Published on {video.publishedAt}
            </p>
          </div>
          <Button 
            onClick={() => openYouTubeVideo(video.id)}
          >
            <Youtube className="btn-icon" />
            View Video
          </Button>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="video-stats">
        <div className="stat-item">
          <h3 className="stat-label">Views</h3>
          <p className="stat-value">{formatNumber(parseInt(video.viewCount))}</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-label">Likes</h3>
          <p className="stat-value">{formatNumber(parseInt(video.likeCount))}</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-label">Comments</h3>
          <p className="stat-value">{formatNumber(parseInt(video.commentCount))}</p>
        </div>
        <div className="stat-item">
          <h3 className="stat-label">Engagement Rate</h3>
          <p className="stat-value">{video.engagementRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="video-description">
        <h3 className="description-title">Description</h3>
        <div className="description-content">
          <p>{video.description}</p>
        </div>
      </div>
    </div>
  );
}