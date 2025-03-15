import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/components_yt/ui/tabs";
import { CreatorsList } from '../../components/components_yt/CreatorsList';
import { VideoStatistics } from '../../components/components_yt/VideoStatistics';
import { AdminPanel } from '../../components/components_yt/AdminPanel';
import { CreatorProfile } from '../../components/components_yt/CreatorProfile';
import { Users, Video, Settings as SettingsIcon, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../components/components_yt/ui/card';
import { formatNumber } from '../../utils/formatNumber';
import '../../styles/main.scss'

import { TestimonialShowcase } from '../../components/TestimonialShowcase/TestimonialShowcase';
import InfluencerFeatured from '../../components/InfluencerFeatured/InfluencerFeatured';


function Influencer() {
  const [apiKey] = useState(import.meta.env.VITE_YOUTUBE_API_KEY || '');
  const [creators, setCreators] = useState([]);
  const [videos, setVideos] = useState([]);
  const [selectedCreatorId, setSelectedCreatorId] = useState(null);

  useEffect(() => {
    const savedCreators = localStorage.getItem('youtubeCreators');
    if (savedCreators) {
      setCreators(JSON.parse(savedCreators));
    }

    const savedVideos = localStorage.getItem('youtubeVideos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
  }, []);

  const handleCreatorsChange = (newCreators) => {
    setCreators(newCreators);
    localStorage.setItem('youtubeCreators', JSON.stringify(newCreators));
  };

  const handleVideosChange = (newVideos) => {
    setVideos(newVideos);
    localStorage.setItem('youtubeVideos', JSON.stringify(newVideos));
  };

  const totalSubscribers = creators.reduce((sum, creator) => 
    sum + parseInt(creator.subscriberCount || '0'), 0
  );

  // Find the top-performing video based on views
  const topVideo = videos.length > 0 
    ? videos.reduce((max, video) => 
        parseInt(video.viewCount || '0') > parseInt(max.viewCount || '0') ? video : max, videos[0])
    : null;

  return (
    <div classname = "influencer">
      <InfluencerFeatured />

      <div className="app">
      <div className="header">
        <div className="header-content">
          <h1 className="app-title text-gradient">
            YouTube Creator Analytics
          </h1>
          <h2>Track, analyze and optimize your YouTube creator network</h2><br>
          </br>
          z
          
          <div className="stats-grid">
            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{formatNumber(totalSubscribers)}</div>
                <div className="stat-label">Total Reach</div>
                <div className="stat-sublabel">Combined followers on YouTube</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{creators.length}</div>
                <div className="stat-label">Active Creators</div>
                <div className="stat-sublabel">Total creators tracked on YouTube</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{creators.length}</div>
                <div className="stat-label">Total Views</div>
                <div className="stat-sublabel">Combined video views</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="stat-content">
                <div className="stat-value">{creators.length}</div>
                <div className="stat-label">Engagement rate</div>
                <div className="stat-sublabel">Average across all videos</div>
              </CardContent>
            </Card>

          </div>

          {/* New Section - Top Performing Video */}
          <div className="top-video-section">
            <h2 className="section-title">🔥 Top Performing Video</h2>
            {topVideo ? (
              <Card>
                <CardContent className="stat-content">
                  <div className="stat-value">{topVideo.title}</div>
                  width={320}
                  height={180}
                  <div className="stat-label">Views: {formatNumber(topVideo.viewCount)}</div>
                  <div className="stat-sublabel">Uploaded by: {topVideo.channelTitle}</div>
                </CardContent>
              </Card>
            ) : (
              <p className="no-data">No video data available</p>
            )}
          </div>

        </div>
      </div>

      
      
      <div className="main-content">
        <Tabs defaultValue="creators" className="tabs">
          <TabsList className="tabs-list-full">
            <TabsTrigger value="creators" className="tabs-trigger">
              <Users className="trigger-icon" />
              Creators List
            </TabsTrigger>
            <TabsTrigger value="video-stats" className="tabs-trigger">
              <Video className="trigger-icon" />
              Video Statistics
            </TabsTrigger>
            <TabsTrigger value="admin" className="tabs-trigger">
              <SettingsIcon className="trigger-icon" />
              Admin Panel
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="creators">
            {selectedCreatorId ? (
              <CreatorProfile 
                apiKey={apiKey}
                channelId={selectedCreatorId}
                onBack={() => setSelectedCreatorId(null)}
              />
            ) : (
              <CreatorsList 
                apiKey={apiKey}
                creators={creators}
                onSelectCreator={setSelectedCreatorId}
                onCreatorsChange={handleCreatorsChange}
              />
            )}
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
              onCreatorsChange={handleCreatorsChange}
              onVideosChange={handleVideosChange}
            />
          </TabsContent>
        </Tabs>

      </div> 
      <TestimonialShowcase />     

    </div>
  );
}

export default Influencer;
