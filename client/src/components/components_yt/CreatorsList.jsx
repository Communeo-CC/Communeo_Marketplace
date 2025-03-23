import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Users, Search, SlidersHorizontal, Filter, ExternalLink, Youtube, ArrowUpDown, MessagesSquare, RefreshCw } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import newRequest from '../../utils/newRequest';
import axios from 'axios';
import './CreatorsList.scss';

const SUBSCRIBER_RANGES = {
  'all': 'All Influencers',
  '0-1000': '0 - 1K',
  '1000-10000': '1K - 10K',
  '10000-100000': '10K - 100K',
  '100000-1000000': '100K - 1M',
  '1000000+': '1M+'
};

const SORT_OPTIONS = {
  'name-asc': 'Name (A-Z)',
  'name-desc': 'Name (Z-A)',
  'subscribers-desc': 'Most Subscribers',
  'subscribers-asc': 'Least Subscribers',
  'views-desc': 'Most Views',
  'views-asc': 'Least Views'
};

export function CreatorsList() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [subscriberRange, setSubscriberRange] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortBy, setSortBy] = useState('name-asc');
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  // Load creators on component mount
  useEffect(() => {
    loadCreators();
  }, []);

  const fetchYouTubeDetails = async (channelId) => {
    try {
      if (!channelId || !channelId.startsWith('UC')) {
        console.warn('Invalid channel ID format:', channelId);
        setError('Invalid channel ID format. Channel ID must start with "UC"');
        return null;
      }

      console.log('Fetching details for channel:', channelId);
      const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`;
      console.log('API URL:', url);

      const response = await axios.get(url);
      console.log('YouTube API Response:', response.data);

      if (!response.data.items || response.data.items.length === 0) {
        console.warn(`No channel found for ID: ${channelId}`);
        setError(`Channel not found: ${channelId}. Please verify the channel ID is correct.`);
        return null;
      }

      const channel = response.data.items[0];
      return {
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnailUrl: channel.snippet.thumbnails.default.url,
        statistics: channel.statistics,
        channelId: channelId,
        id: channelId
      };
    } catch (err) {
      console.error('YouTube API Error:', {
        message: err.message,
        response: err.response?.data,
        channelId: channelId
      });
      
      if (err.response?.status === 403) {
        setError('YouTube API key error: Please check your API key configuration');
      } else if (err.response?.status === 400) {
        setError(`Invalid channel ID format: ${channelId}. Please verify the channel ID is correct.`);
      } else {
        setError(`Failed to fetch YouTube channel details: ${err.message}`);
      }
      return null;
    }
  };

  const loadCreators = async () => {
    setLoading(true);
    setError('');
    try {
      // First, get all channels from our database
      const response = await newRequest.get('/channels');
      const channels = response.data;
      console.log('Loaded channels from database:', channels);

      // Fetch YouTube details for each channel
      const creatorPromises = channels.map(async (channel) => {
        const youtubeDetails = await fetchYouTubeDetails(channel.channelId);
        if (youtubeDetails) {
          return {
            ...youtubeDetails,
            id: channel.channelId,
            isRegistered: true,
            email: channel.email || '',
            username: channel.username || '',
            userId: channel.userId || '',
            statistics: youtubeDetails.statistics
          };
        }
        return null;
      });

      const creatorDetails = (await Promise.all(creatorPromises)).filter(creator => creator !== null);
      console.log('Processed creator details:', creatorDetails);
      
      // Save to localStorage and update state
      localStorage.setItem('youtubeInfluencers', JSON.stringify(creatorDetails));
      setCreators(creatorDetails);
    } catch (err) {
      const errorMessage = 'Failed to load creators: ' + (err.response?.data?.message || err.message);
      setError(errorMessage);
      console.error('Error loading creators:', {
        error: err,
        message: err.message,
        response: err.response?.data
      });
    } finally {
      setLoading(false);
    }
  };

  const syncCreators = async () => {
    setLoading(true);
    setError('');
    try {
      await loadCreators(); // Just reload the creators since we're fetching from channels
    } catch (err) {
      setError('Failed to sync creators');
      console.error('Error syncing creators:', err);
    } finally {
      setLoading(false);
    }
  };

  const isInSubscriberRange = (subscriberCount) => {
    const count = parseInt(subscriberCount);
    switch (subscriberRange) {
      case '0-1000':
        return count >= 0 && count < 1000;
      case '1000-10000':
        return count >= 1000 && count < 10000;
      case '10000-100000':
        return count >= 10000 && count < 100000;
      case '100000-1000000':
        return count >= 100000 && count < 1000000;
      case '1000000+':
        return count >= 1000000;
      default:
        return true;
    }
  };

  const updateActiveFilters = () => {
    const filters = [];
    if (subscriberRange !== 'all') filters.push(SUBSCRIBER_RANGES[subscriberRange]);
    setActiveFilters(filters);
  };

  const applyFilters = () => {
    updateActiveFilters();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSubscriberRange('all');
    setActiveFilters([]);
    setShowFilters(false);
  };

  const sortCreators = (creators) => {
    return [...creators].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'subscribers-desc':
          return parseInt(b.statistics?.subscriberCount || 0) - parseInt(a.statistics?.subscriberCount || 0);
        case 'subscribers-asc':
          return parseInt(a.statistics?.subscriberCount || 0) - parseInt(b.statistics?.subscriberCount || 0);
        case 'views-desc':
          return parseInt(b.statistics?.viewCount || 0) - parseInt(a.statistics?.viewCount || 0);
        case 'views-asc':
          return parseInt(a.statistics?.viewCount || 0) - parseInt(b.statistics?.viewCount || 0);
        default:
          return 0;
      }
    });
  };

  const filteredCreators = sortCreators(
    creators.filter(creator => {
      const matchesSearch = creator.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubscribers = isInSubscriberRange(creator.statistics?.subscriberCount || 0);
      return matchesSearch && matchesSubscribers;
    })
  );

  const handleViewProfile = (creator) => {
    const urlSafeTitle = creator.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/influencer/${creator.id}/${urlSafeTitle}`);
  };

  return (
    <div className="creators-list">
      <Card>
        <CardHeader>
          <div className="filter-header">
            <CardTitle>Influencers List</CardTitle>
            <div className="filter-controls">
              {activeFilters.length > 0 && (
                <div className="active-filters">
                  <Filter className="filter-icon" />
                  <span className="filter-text">
                    {activeFilters.length} active filter{activeFilters.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={syncCreators}
                  disabled={loading}
                >
                  <RefreshCw className={`btn-icon ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Syncing...' : 'Sync Creators'}
                </Button>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                  <SlidersHorizontal className="btn-icon" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
          {error && (
            <div className="error-message mt-2 text-red-500">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search influencers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="creators-grid">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="creator-card">
                <CardContent className="creator-content">
                  <div className="creator-avatar-container">
                    <img
                      src={creator.thumbnailUrl}
                      alt={creator.title}
                    />
                  </div>
                  <div className="creator-info">
                    <h3 className="creator-name">
                      {creator.title}
                      {creator.isRegistered && (
                        <span className="registered-badge">Registered</span>
                      )}
                    </h3>
                    <div className="creator-stats">
                      <div className="stat-item">
                        <p className="stat-label">Subscribers</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.statistics?.subscriberCount || 0))}
                        </p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Views</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.statistics?.viewCount || 0))}
                        </p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Videos</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.statistics?.videoCount || 0))}
                        </p>
                      </div>
                    </div>
                    {creator.isRegistered && (
                      <div className="creator-contact">

                      </div>
                    )}
                    <div className="creator-footer">
                      <div className="creator-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProfile(creator)}
                        >
                          <ExternalLink className="btn-icon" />
                          View Profile
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewProfile(creator)}
                        >
                          <MessagesSquare className="btn-icon" />
                          Connect Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCreators.length === 0 && !loading && (
              <div className="empty-state">
                No influencers found matching your criteria
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
                <p>Loading creators...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <Filter className="dialog-icon" />
              Filter Influencers
            </DialogTitle>
          </DialogHeader>
          <div className="filter-form">
            <div className="filter-group">
              <div className="filter-header">
                <label className="filter-label">
                  Subscriber Range
                </label>
                {subscriberRange !== 'all' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSubscriberRange('all')}
                    className="filter-clear"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <Select
                value={subscriberRange}
                onValueChange={(value) => setSubscriberRange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUBSCRIBER_RANGES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="dialog-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              Reset All
            </Button>
            <Button
              size="sm"
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}