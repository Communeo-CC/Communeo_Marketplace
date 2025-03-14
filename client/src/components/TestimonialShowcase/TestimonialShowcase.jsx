import React from 'react';
import { Card, CardContent } from '../../components/components_yt/ui/card';
import { Star, TrendingUp, BarChart2, Award } from 'lucide-react';
import "./TestimonialShowcase.scss";

export const TestimonialShowcase = () => {
  const testimonials = [
    {
      quote: "This platform helped me grow my YouTube channel by 300% in just 6 months!",
      creator: "Alex Morgan",
      channel: "TechTalks Daily",
      subscribers: "1.2M"
    },
    {
      quote: "The analytics insights gave me exactly what I needed to optimize my content strategy.",
      creator: "Jamie Lee",
      channel: "Creative Minds",
      subscribers: "842K"
    },
    {
      quote: "Tracking my creator network has never been easier. This tool is a game-changer!",
      creator: "Sam Rodriguez",
      channel: "Travel Adventures",
      subscribers: "2.5M"
    }
  ];

  const features = [
    {
      icon: <TrendingUp className="feature-icon" />,
      title: "Growth Tracking",
      description: "Monitor subscriber growth and engagement metrics over time."
    },
    {
      icon: <BarChart2 className="feature-icon" />,
      title: "Advanced Analytics",
      description: "Get deep insights into your audience demographics and preferences."
    },
    {
      icon: <Award className="feature-icon" />,
      title: "Performance Comparison",
      description: "Compare your performance against other creators in your niche."
    }
  ];

  return (
    <div className="testimonial-showcase">
      <div className="showcase-header">
        <h2 className="text-gradient">Why Creators Love Our Platform</h2>
        <p className="showcase-subtitle">Join thousands of successful YouTubers who trust our analytics platform</p>
      </div>

      <div className="testimonials-container">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="testimonial-card">
            <CardContent className="testimonial-content">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} fill="#FFD700" stroke="#FFD700" size={16} />
                ))}
              </div>
              <blockquote className="quote">"{testimonial.quote}"</blockquote>
              <div className="creator-info">
                <div className="creator-name">{testimonial.creator}</div>
                <div className="channel-info">
                  {testimonial.channel} • {testimonial.subscribers} subscribers
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="features-section">
        <h3>Powerful Features for Creator Success</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <CardContent className="feature-content">
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};