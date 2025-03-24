import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="top">
          <div className="logo-section">
            <div className="logo">
              <span className="text">Communeo</span>
              <span className="dot">.</span>
            </div>
            <p className="tagline">
              Bringing communities together through shared connections.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="icon-facebook"></i>
              </a>
              <a href="#" className="social-link">
                <i className="icon-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="icon-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about" className="link">About Us</Link></li>
                <li><Link to="/careers" className="link">Careers</Link></li>
                <li><Link to="/contact" className="link">Contact</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li><Link to="/freelancer" className="link">Freelancers</Link></li>
                <li><Link to="/influencer" className="link">Influencers</Link></li>
                <li><Link to="/register" className="link">Become a Seller</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contact</h3>
              <ul className="contact-info">
                <li>
                  <i className="icon-mail"></i>
                  <span>hello@communeo.com</span>
                </li>
                <li>
                  <i className="icon-phone"></i>
                  <span>(123) 456-7890</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bottom">
          <div className="copyright">
            © {new Date().getFullYear()} Communeo. All rights reserved.
          </div>
          <div className="legal">
            <Link to="/privacy" className="link">Privacy Policy</Link>
            <Link to="/terms" className="link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;