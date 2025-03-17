import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/components_yt/ui/tabs";
import { CreatorsList } from '../../components/components_yt/CreatorsList';
import { VideoStatistics } from '../../components/components_yt/VideoStatistics';
import { AdminPanel } from '../../components/components_yt/AdminPanel';
import { CreatorProfile } from '../../components/components_yt/CreatorProfile';
import { Users, Video, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/components_yt/ui/card';
import { formatNumber } from '../../utils/formatNumber';
import VideoAnalyticsSummary from '../../components/VideoAnalyticsSummary/VideoAnalyticsSummary';
import UpcomingFeatures from '../../components/UpcomingFeatures/UpcomingFeatures';
import '../../styles/main.scss'
import InfluencerFeatured from '../../components/InfluencerFeatured/InfluencerFeatured';

function Influencer() {
  const [apiKey] = useState(import.meta.env.VITE_YOUTUBE_API_KEY || '');
  const [influencers, setInfluencers] = useState([]);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const savedInfluencers = localStorage.getItem('youtubeInfluencers');
    if (savedInfluencers) {
      setInfluencers(JSON.parse(savedInfluencers));
    }

    const savedVideos = localStorage.getItem('youtubeVideos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  const handleInfluencersChange = (newInfluencers) => {
    setInfluencers(newInfluencers);
    localStorage.setItem('youtubeInfluencers', JSON.stringify(newInfluencers));
  };

  const handleVideosChange = (newVideos) => {
    setVideos(newVideos);
    localStorage.setItem('youtubeVideos', JSON.stringify(newVideos));
  };

  const totalSubscribers = influencers.reduce((sum, influencer) => 
    sum + parseInt(influencer.subscriberCount || '0'), 0
  );

  return (
    <div classname = "Influencer">
      <InfluencerFeatured />
    <div className="app">
      <div className="header">
        <div className="header-content">
          <h1 className="app-title text-gradient">
            YouTube Creator Analytics
          </h1>
          
          <div className="stats-grid">
            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{formatNumber(totalSubscribers)}</div>
                <div className="stat-label">Total Reach</div>
                <div className="stat-sublabel">Combined social following</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{influencers.length}</div>
                <div className="stat-label">Tracked Influencers</div>
                <div className="stat-sublabel">Active content creators</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <Routes>
          <Route path=":creatorId/:creatorName" element={
            <CreatorProfile 
              apiKey={apiKey}
              creators={influencers}
              onBack={() => navigate('/influencer')}
            />
          } />
          
          <Route index element={
            <Tabs defaultValue="influencers" className="tabs">
              <TabsList className="tabs-list-full">
                <TabsTrigger value="influencers" className="tabs-trigger">
                  <Users className="trigger-icon" />
                  Influencers
                </TabsTrigger>
                <TabsTrigger value="video-stats" className="tabs-trigger">
                  <Video className="trigger-icon" />
                  Content Analytics
                </TabsTrigger>
                <TabsTrigger value="admin" className="tabs-trigger">
                  <SettingsIcon className="trigger-icon" />
                  Management
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="influencers">
                <CreatorsList 
                  apiKey={apiKey}
                  creators={influencers}
                  onCreatorsChange={handleInfluencersChange}
                />
              </TabsContent>

              <TabsContent value="video-stats">
                <VideoStatistics 
                  apiKey={apiKey}
                  videos={videos}
                  onVideosChange={handleVideosChange}
                />
              </TabsContent>

              <TabsContent value="admin">
                <AdminPanel 
                  apiKey={apiKey}
                  onCreatorsChange={handleInfluencersChange}
                  onVideosChange={handleVideosChange}
                />
              </TabsContent>
            </Tabs>
          } />
        </Routes>
      </div>
        <VideoAnalyticsSummary />
        <UpcomingFeatures />
    </div>
    </div>
  );
}

export default Influencer;