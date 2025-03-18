import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Users, Search, SlidersHorizontal, Filter, ExternalLink, Youtube } from 'lucide-react';
import { formatNumber } from '../../utils/formatNumber';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SUBSCRIBER_RANGES = {
  'all': 'All Creators',
  '0-1000': '0 - 1K',
  '1000-10000': '1K - 10K',
  '10000-100000': '10K - 100K',
  '100000-1000000': '100K - 1M',
  '1000000+': '1M+'
};

export function CreatorsList({ apiKey, creators, onSelectCreator, onCreatorsChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [subscriberRange, setSubscriberRange] = useState('all');
  const [activeFilters, setActiveFilters] = useState([]);

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

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubscribers = isInSubscriberRange(creator.subscriberCount);
    return matchesSearch && matchesSubscribers;
  });

  const openYouTubeChannel = (channelId) => {
    window.open(`https://youtube.com/channel/${channelId}`, '_blank');
  };

  return (
    <div className="creators-list">
      <Card>
        <CardHeader>
          <div className="filter-header">
            <CardTitle>Creators List</CardTitle>
            <div className="filter-controls">
              {activeFilters.length > 0 && (
                <div className="active-filters">
                  <Filter className="filter-icon" />
                  <span className="filter-text">
                    {activeFilters.length} active filter{activeFilters.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowFilters(true)}>
                <SlidersHorizontal className="btn-icon" />
                Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="search-container">
            <Search className="search-icon" />
            <Input
              placeholder="Search creators..."
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
                    <h3 className="creator-name">{creator.title}</h3>
                    <div className="creator-stats">
                      <div className="stat-item">
                        <p className="stat-label">Subscribers</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.subscriberCount))}
                        </p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Views</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.viewCount))}
                        </p>
                      </div>
                      <div className="stat-item">
                        <p className="stat-label">Videos</p>
                        <p className="stat-value">
                          {formatNumber(parseInt(creator.videoCount))}
                        </p>
                      </div>
                    </div>
                    <div className="creator-footer">
                      <p className="creator-about">
                        {creator.about || 'No notes added yet'}
                      </p>
                      <div className="creator-actions">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openYouTubeChannel(creator.id)}
                        >
                          <Youtube className="btn-icon" />
                          View Channel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onSelectCreator(creator.id)}
                        >
                          <ExternalLink className="btn-icon" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCreators.length === 0 && (
              <div className="empty-state">
                No creators found matching your criteria
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
              Filter Creators
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