import React from 'react';
import './about.scss';
import teamImg from "../../assets/sanuri.gif"; // You'll need to add this image to your assets folder

const About = () => {
  const teamMembers = [
    { name: "Visal Vithanage", role: "Project Lead" },
    { name: "Thamindu Wickramaarachchi", role: "Full Stack Developer" },
    { name: "Kaveesha Liyanaarachchi", role: "UI/UX Designer" },
    { name: "Vidul Wickramasinghe", role: "Backend Developer" },
    { name: "Hirushi Perera", role: "Frontend Developer" },
    { name: "Sanuri Perera", role: "Marketing Specialist" }
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
            <div className="icon">💸</div>
            <h3>High Marketing Costs</h3>
            <p>Traditional marketing agencies charge premium rates with minimal transparency</p>
          </div>
          <div className="problem-card">
            <div className="icon">🔍</div>
            <h3>Difficult Connections</h3>
            <p>Businesses struggle to find the right influencers for their target audience</p>
          </div>
          <div className="problem-card">
            <div className="icon">🌐</div>
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
        <h2>Meet Our Team</h2>
        <p className="team-intro">
          We are CS-04, a group of passionate developers and marketers from the University of Westminster,
          committed to revolutionizing social media marketing in Sri Lanka.
        </p>
        
        <div className="team-photo">
          {/* Replace with actual team photo */}
          <img src={teamImg} alt="Communeo Team" />
        </div>
        
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div className="member-card" key={index}>
              <div className="member-avatar">
                {member.name.charAt(0)}
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
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