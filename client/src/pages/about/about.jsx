import React, { useEffect, useRef } from 'react';
import './about.scss';

const About = () => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Play the video when component mounts
    video.play().catch(err => {
      console.log('Autoplay prevented:', err);
      // Some browsers require user interaction before autoplay
      // You might want to show a message to the user in this case
    });
    
  }, []); // Empty dependency array means this effect runs only once on mount
  
  const teamMembers = [
    { 
      name: "Kaveesha Liyanaarachchi", 
      role: "UI/UX Designer",
      image: "./img/kaveesha.jpg",
      linkedin: "https://www.linkedin.com/in/kaveesha-liyanaarachchi/"
    },
    { 
      name: "Sanuri Perera", 
      role: "Full Stack Developer",
      image: "./img/sanuri1.jpg",
      linkedin: "https://www.linkedin.com/in/sanuri-perera/"
    },
    { 
      name: "Hirushi Perera", 
      role: "Frontend Developer",
      image: "./img/hirushi1.jpg",
      linkedin: "https://www.linkedin.com/in/hirushi-perera/"
    },
    { 
      name: "Visal Vithanage", 
      role: "Project Lead",
      image: "./img/visal.jpg",
      linkedin: "https://www.linkedin.com/in/visal-vithanage/"
    },
    { 
      name: "Vidul Wickramasinghe", 
      role: "Backend Developer",
      image: "./img/vidul1.jpg",
      linkedin: "https://www.linkedin.com/in/vidul-wickramasinghe/"
    },
    { 
      name: "Thamindu Wickramaarachchi", 
      role: "Marketing Specialist",
      image: "./img/thamindu.jpg",
      linkedin: "https://www.linkedin.com/in/thamindu-wickramaarachchi/"
    }
  ];

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Communeo</h1>
        <div className="underline"></div>
      </div>
      
      <section className="about-mission">
        <div className="mission-content">
          <h2>Our Mission</h2>
          <p>
            Communeo is bridging the gap between Sri Lankan businesses and content creators, 
            eliminating intermediaries to make social media marketing more accessible, 
            authentic, and effective.
          </p>
          <p>
            We believe in empowering small businesses and startups with affordable, 
            direct marketing options while connecting them with talented influencers 
            who understand the local market and culture.
          </p>
        </div>
        <div className="mission-image">
          <div className="image-container"></div>
        </div>
      </section>

      <section className="about-problem">
        <h2>The Problem We're Solving</h2>
        <div className="problem-cards">
          <div className="problem-card">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <line x1="2" y1="12" x2="22" y2="12"></line>
              </svg>
            </div>
            <h3>High Marketing Costs</h3>
            <p>Traditional marketing agencies charge premium rates with minimal transparency</p>
          </div>
          <div className="problem-card">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3>Difficult Connections</h3>
            <p>Businesses struggle to find the right influencers for their target audience</p>
          </div>
          <div className="problem-card">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </div>
            <h3>Cultural & Language Gaps</h3>
            <p>Global platforms often miss local cultural nuances and language preferences</p>
          </div>
        </div>
      </section>

      <section className="about-solution">
        <h2>Our Solution</h2>
        <div className="solution-content">
          <div className="solution-features">
            <ul>
              <li>
                <span className="feature-highlight">Direct Connections</span>
                <p>Direct links between businesses and influencers without intermediaries</p>
              </li>
              <li>
                <span className="feature-highlight">AI-Powered Matching</span>
                <p>Smart technology that connects businesses with the perfect content creators</p>
              </li>
              <li>
                <span className="feature-highlight">Real-Time Analytics</span>
                <p>Transparent performance metrics to measure campaign success</p>
              </li>
              <li>
                <span className="feature-highlight">Local Focus</span>
                <p>Designed specifically for Sri Lankan businesses and influencers</p>
              </li>
            </ul>
          </div>
          <div className="solution-image">
            <div className="image-container"></div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="team-video-container">
          <video 
            ref={videoRef}
            controls
            autoPlay
            loop
            muted
            className="team-video"
            poster="/path-to-poster-image.jpg"
          >
            <source src="./img/about.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <h2>Meet Our Team</h2>
        <p className="team-intro">
          We are group of passionate developers and marketers from the University of Westminster,
          committed to revolutionizing social media marketing in Sri Lanka.
        </p>
        
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div className="member-card" key={index}>
              <div className="member-image-container">
                <div className="image-border">
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`} 
                    className="member-image"
                  />
                </div>
              </div>
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="linkedin-button"
              >
                Connect on LinkedIn
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="about-future">
        <h2>Our Vision</h2>
        <p>
          We envision a future where every Sri Lankan business, regardless of size, 
          can harness the power of social media marketing through authentic local voices.
          Communeo aims to become the premier marketplace connecting businesses with 
          content creators throughout South Asia, fostering economic growth 
          and digital innovation across the region.
        </p>
      </section>

      <section className="about-contact">
        <h2>Get In Touch</h2>
        <p>
          Have questions about Communeo? Want to join our platform as a beta tester?
          We'd love to hear from you!
        </p>
        <button className="contact-btn">Contact Us</button>
      </section>
    </div>
  );
};

export default About;