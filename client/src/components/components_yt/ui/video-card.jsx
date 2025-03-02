import { Card, CardContent } from './card';
import { Eye, ThumbsUp, MessageCircle, Activity } from 'lucide-react';
import { formatNumber } from '../../../utils/formatNumber';
import { clsx } from 'clsx';

export function VideoCard({ video, onClick }) {
  return (
    <Card 
      className="video-card" 
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="video-thumbnail">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
          />
          <div className="video-date">
            {video.publishedAt}
          </div>
        </div>
        <div className="video-content">
          <h4 className="video-title">{video.title}</h4>
          <div className="video-stats">
            <div className="stat-item">
              <Eye className="stat-icon" />
              <span>{formatNumber(parseInt(video.viewCount))}</span>
            </div>
            <div className="stat-item">
              <ThumbsUp className="stat-icon" />
              <span>{formatNumber(parseInt(video.likeCount))}</span>
            </div>
            <div className="stat-item">
              <MessageCircle className="stat-icon" />
              <span>{formatNumber(parseInt(video.commentCount))}</span>
            </div>
            <div className="stat-item">
              <Activity className="stat-icon" />
              <span>{video.engagementRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}