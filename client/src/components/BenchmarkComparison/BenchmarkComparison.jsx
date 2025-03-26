import React from 'react';
import './BenchmarkComparison.scss';

const BenchmarkComparison = () => {
  // Sample benchmark data - replace with actual data
  const benchmarks = [
    {
      metric: "Viewer Retention",
      yourScore: 68,
      industryAvg: 52,
      topPerformers: 79,
      isPositive: true
    },
    {
      metric: "Engagement Rate",
      yourScore: 8.4,
      industryAvg: 5.2,
      topPerformers: 12.7,
      isPositive: true
    },
    {
      metric: "Click-Through Rate",
      yourScore: 3.2,
      industryAvg: 4.1,
      topPerformers: 6.5,
      isPositive: false
    }
  ];

  return (
    <section className="benchmark-comparison">
      <div className="container">
        <h2 className="section-title">How You Compare</h2>
        <p className="section-description">See how your content performs against industry standards</p>
        
        <div className="benchmarks-container">
          {benchmarks.map((benchmark, index) => (
            <div className="benchmark-card" key={index}>
              <div className="metric-name">{benchmark.metric}</div>
              
              <div className="score-container">
                <div className="score-item your-score">
                  <div className="score-value">{benchmark.yourScore}%</div>
                  <div className="score-label">Your Score</div>
                </div>
                
                <div className="comparison-indicator">
                  <span className={benchmark.isPositive ? 'positive' : 'negative'}>
                    {benchmark.isPositive ? '↑' : '↓'}
                  </span>
                </div>
                
                <div className="score-item industry-avg">
                  <div className="score-value">{benchmark.industryAvg}%</div>
                  <div className="score-label">Industry Avg</div>
                </div>
              </div>
              
              <div className="benchmark-bar">
                <div className="industry-marker" style={{ left: `${benchmark.industryAvg}%` }}>
                  <div className="marker-line"></div>
                  <div className="marker-label">Avg</div>
                </div>
                <div className="top-marker" style={{ left: `${benchmark.topPerformers}%` }}>
                  <div className="marker-line"></div>
                  <div className="marker-label">Top</div>
                </div>
                <div className="your-progress" style={{ width: `${benchmark.yourScore}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="benchmark-footer">
          <a href="#" className="view-details-link">View detailed benchmarks by industry</a>
        </div>
      </div>
    </section>
  );
};

export default BenchmarkComparison;