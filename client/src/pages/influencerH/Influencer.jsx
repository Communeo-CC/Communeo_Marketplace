import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/components_yt/ui/tabs";
import { CreatorsList } from '../../components/components_yt/CreatorsList';
import { VideoStatistics } from '../../components/components_yt/VideoStatistics';
import { AdminPanel } from '../../components/components_yt/AdminPanel';
import { CreatorProfile } from '../../components/components_yt/CreatorProfile';
import { Users, Video, Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/components_yt/ui/card';
import { formatNumber } from '../../utils/formatNumber';
import '../../styles/main.scss'

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

  return (
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
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <Tabs defaultValue="creators" className="tabs">
          <TabsList className="tabs-list-full">
            <TabsTrigger 
              value="creators"
              className="tabs-trigger"
            >
              <Users className="trigger-icon" />
              Creators List
            </TabsTrigger>
            <TabsTrigger 
              value="video-stats"
              className="tabs-trigger"
            >
              <Video className="trigger-icon" />
              Video Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="admin"
              className="tabs-trigger"
            >
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
    </div>
  );
}

export default Influencer;