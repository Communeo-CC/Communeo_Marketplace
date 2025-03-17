import React from 'react';
import './UpcomingFeatures.scss';

const UpcomingFeatures = () => {
  const features = [
    {
      title: "AI-Powered Insights",
      date: "April 2025",
      description: "Predictive analytics to forecast video performance"
    },
    {
      title: "Audience Demographics",
      date: "May 2025",
      description: "Detailed viewer breakdown by age, location, and interests"
    },
    {
      title: "Competitor Analysis",
      date: "June 2025",
      description: "Compare your performance with similar content creators"
    }
  ];

  return (
    <section className="upcoming-features">
      <div className="container">
        <h2 className="section-title">Coming Soon</h2>
        
        <div className="features-timeline">
          {features.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-date">{feature.date}</div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="feedback-prompt">
          <p>Have feature suggestions? <a href="#">Submit feedback</a></p>
        </div>
      </div>
    </section>
  );
};

export default UpcomingFeatures;