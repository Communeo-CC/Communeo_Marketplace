import React from 'react';
import './VideoAnalyticsSummary.scss';

const VideoAnalyticsSummary = () => {
  // Sample data - replace with your actual data
  const analyticsData = {
    totalViews: 24859,
    averageWatchTime: '4:32',
    completionRate: 68,
    engagement: 76,
    topDevices: [
      { name: 'Mobile', percentage: 65 },
      { name: 'Desktop', percentage: 30 },
      { name: 'Tablet', percentage: 5 }
    ]
  };

  return (
    <section className="video-analytics-summary">
      <div className="container">
        <h2 className="section-title">Video Performance Summary</h2>
        
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Views</h3>
            <div className="metric">{analyticsData.totalViews.toLocaleString()}</div>
          </div>
          
          <div className="summary-card">
            <h3>Average Watch Time</h3>
            <div className="metric">{analyticsData.averageWatchTime}</div>
          </div>
          
          <div className="summary-card">
            <h3>Completion Rate</h3>
            <div className="metric">{analyticsData.completionRate}%</div>
          </div>
          
          <div className="summary-card">
            <h3>Engagement Score</h3>
            <div className="metric">{analyticsData.engagement}%</div>
          </div>
        </div>
        
        <div className="device-breakdown">
          <h3>Audience by Device</h3>
          <div className="device-bars">
            {analyticsData.topDevices.map((device, index) => (
              <div className="device-bar-container" key={index}>
                <div className="device-label">{device.name}</div>
                <div className="device-bar-wrapper">
                  <div 
                    className="device-bar" 
                    style={{ width: `${device.percentage}%` }}
                  ></div>
                  <span className="device-percentage">{device.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoAnalyticsSummary;