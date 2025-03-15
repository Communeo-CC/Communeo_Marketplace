import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StatCard } from './ui/stat-card';
import { VideoCard } from './ui/video-card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { fetchChannelDetails, fetchChannelVideos } from '../../utils/youtube';
import { Users, Eye, Activity, Loader2, ArrowLeft, Video, Youtube } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';
import { VideoAnalysis } from './VideoAnalysis';

export function CreatorProfile({ apiKey, creators }) {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [channelDetails, videos] = await Promise.all([
          fetchChannelDetails(creatorId, apiKey),
          fetchChannelVideos(creatorId, apiKey)
        ]);

        const creator = creators.find(c => c.id === creatorId);
        const about = creator?.about || '';

        const avgEngagementRate = videos.reduce((sum, video) => sum + video.engagementRate, 0) / videos.length;

        setChannelData({
          ...channelDetails,
          recentVideos: videos,
          avgEngagementRate,
          about
        });
      } catch (err) {
        setError('Error fetching influencer data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [creatorId, apiKey, creators]);

  const openYouTubeChannel = () => {
    window.open(`https://youtube.com/channel/${creatorId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="creator-profile">
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="error-card">
        <CardContent className="error-content">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!channelData) return null;

  return (
    <div className="creator-profile" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
      <div className="profile-header">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/influencer')}
        >
          <ArrowLeft className="btn-icon" />
          Back to Influencers
        </Button>
        <Button
          variant="outline"
          onClick={openYouTubeChannel}
        >
          <Youtube className="btn-icon" />
          View on YouTube
        </Button>
      </div>

      <Card className="profile-card">
        <CardContent className="profile-content">
          <img
            src={channelData.thumbnailUrl}
            alt={channelData.title}
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2 className="profile-title">{channelData.title}</h2>
            <p className="profile-description">
              {channelData.description || 'Professional content creator and influencer'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="stats-grid">
        <StatCard
          title="Subscribers"
          value={formatNumber(parseInt(channelData.subscriberCount))}
          icon={<Users className="w-5 h-5" />}
          tooltip="Total YouTube subscribers"
        />
        <StatCard
          title="Total Views"
          value={formatNumber(parseInt(channelData.viewCount))}
          icon={<Eye className="w-5 h-5" />}
          tooltip="Lifetime video views"
        />
        <StatCard
          title="Total Videos"
          value={formatNumber(parseInt(channelData.videoCount))}
          icon={<Video className="w-5 h-5" />}
          tooltip="Total published videos"
        />
        <StatCard
          title="Avg. Engagement Rate"
          value={`${channelData.avgEngagementRate.toFixed(1)}%`}
          icon={<Activity className="w-5 h-5" />}
          tooltip="Average viewer engagement rate"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex-between">
            <CardTitle>Latest Videos</CardTitle>
            <Button onClick={() => navigate(`/influencer/${creatorId}/${channelData.title}`)}>
              View All
            </Button>

          </div>
        </CardHeader>
        <CardContent>
          <div className="videos-grid">
            {channelData.recentVideos.map((video) => (
              <VideoCard 
                key={video.id} 
                video={video} 
                onClick={() => setSelectedVideo(video)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="dialog-content-large">
          <DialogHeader>
            <DialogTitle>Content Performance</DialogTitle>
          </DialogHeader>
          {selectedVideo && <VideoAnalysis video={selectedVideo} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}