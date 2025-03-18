import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-company">
            <h2 className="footer-title">Communeo</h2>
            <p className="footer-description">
            Empowering brands and influencers with seamless collaboration, AI-driven insights, and data-backed growth.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="icon-facebook"></i>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="social-link">
                <i className="icon-twitter"></i>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="social-link">
                <i className="icon-instagram"></i>
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="social-link">
                <i className="icon-linkedin"></i>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-list">
              <li>
                <a href="/" className="footer-link">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="footer-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/events" className="footer-link">
                  Events
                </a>
              </li>
              <li>
                <a href="/communities" className="footer-link">
                  Communities
                </a>
              </li>
              <li>
                <a href="/blog" className="footer-link">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h3 className="footer-heading">Contact Us</h3>
            <ul className="footer-list">
              <li className="contact-item">
                <i className="icon-map-pin"></i>
                <span>Address</span>
              </li>
              <li className="contact-item">
                <i className="icon-phone"></i>
                <span>(123) 456-7890</span>
              </li>
              <li className="contact-item">
                <i className="icon-mail"></i>
                <span>communeo.live</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h3 className="footer-heading">Stay in the loop</h3>
            <p className="newsletter-text">Get the latest influencer marketing trends, platform updates, and exclusive insights straight to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" className="newsletter-input" />
              <button type="submit" className="newsletter-button">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} Communeo. All rights reserved.</p>
          <div className="legal-links">
            <a href="/privacy" className="legal-link">
              Privacy Policy
            </a>
            <a href="/terms" className="legal-link">
              Terms of Service
            </a>
            <a href="/cookies" className="legal-link">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer