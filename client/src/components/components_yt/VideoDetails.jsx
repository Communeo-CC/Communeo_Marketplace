import React, { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const VideoDetails = ({ apiKey }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchVideoDetails = async () => {
    setError('');
    setLoading(true);
    setVideoData(null);

    const videoId = extractVideoId(videoUrl);
    
    if (!videoId) {
      setError('Invalid YouTube URL');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`
      );

      if (response.data.items.length === 0) {
        setError('Video not found');
        setLoading(false);
        return;
      }

      const video = response.data.items[0];
      setVideoData({
        title: video.snippet.title,
        description: video.snippet.description,
        channelTitle: video.snippet.channelTitle,
        publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        thumbnailUrl: video.snippet.thumbnails.high.url,
      });
    } catch (err) {
      setError('Error fetching video details. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Enter YouTube video URL"
          />
          <Button onClick={fetchVideoDetails} disabled={loading}>
            {loading ? 'Loading...' : 'Get Details'}
          </Button>
        </div>

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {videoData && (
          <div className="space-y-4">
            <img
              src={videoData.thumbnailUrl}
              alt={videoData.title}
              className="w-full rounded-lg"
            />
            <h2 className="text-2xl font-bold">{videoData.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Channel</p>
                <p className="font-medium">{videoData.channelTitle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-medium">{videoData.publishedAt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <p className="font-medium">{parseInt(videoData.viewCount).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Likes</p>
                <p className="font-medium">{parseInt(videoData.likeCount).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 whitespace-pre-wrap">{videoData.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};