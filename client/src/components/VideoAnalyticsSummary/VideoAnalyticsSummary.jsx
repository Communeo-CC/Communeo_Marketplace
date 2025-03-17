import React from 'react';
import './VideoAnalyticsSummary.scss';

const VideoResources = () => {
    // Sample resources that would complement video analytics
    const resources = [
      {
        id: 1,
        title: "Growth Strategies for Content Creators",
        description: "Learn proven methods to expand your audience and increase engagement.",
        icon: "📈",
        linkText: "Read Guide",
        link: "https://socialbuzzhive.com/25-creator-ideas-and-strategies-to-captivate-your-audience-in-2025/"
      },
      {
        id: 2,
        title: "Video Optimization Checklist",
        description: "Essential steps to ensure your videos perform well across all platforms.",
        icon: "✅",
        linkText: "Do it now",
        link: "https://checklist.gg/templates/youtube-video-optimization-checklist"
      },
      {
        id: 3,
        title: "Audience Retention Masterclass",
        description: "Discover techniques to keep viewers watching longer.",
        icon: "⏱️",
        linkText: "More Details",
        link: "https://www.youtube.com/watch?v=nhnqTfPDlBE#:~:text=Get%20practical%20tips%20on%20creating%20a%20content%20schedule%2C,explore%20effective%20techniques%20for%20keeping%20your%20audience%20engaged."
      },
      {
        id: 4,
        title: "Monetization Calculator",
        description: "Estimate potential earnings based on your current analytics.",
        icon: "💰",
        linkText: "Try Calculator",
        link: "https://www.lenostube.com/en/youtube-money-calculator/"
      }
    ];
  
    return (
      <section className="video-resources">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Resources to Improve Your Performance</h2>
            <p className="section-subtitle">Tools and guides to help you grow your channel</p>
          </div>
          
          <div className="resource-grid">
            {resources.map(resource => (
              <div className="resource-card" key={resource.id}>
                <div className="resource-icon">{resource.icon}</div>
                <div className="resource-info">
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                </div>
                <a href={resource.link} className="resource-link" target="_blank" rel="noopener noreferrer">
                  {resource.linkText}
                </a>
              </div>
            ))}
          </div>
          
          <div className="help-callout">
            <div className="callout-content">
              <h3>Need personalized advice?</h3>
              <p>Schedule a consultation with one of our content strategists to analyze your specific analytics data.</p>
            </div>
            <button className="schedule-btn">Schedule Consultation</button>
          </div>
        </div>
      </section>
    );
  };
  
export default VideoResources;
