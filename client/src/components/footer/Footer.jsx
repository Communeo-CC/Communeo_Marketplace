import React from "react"; 
import { Link } from "react-router-dom"; 
import "./Footer.scss";

// Import social media icons
import youtubeIcon from '../../assets/youtube.png';
import facebookIcon from '../../assets/facebook1.png';
import instagramIcon from '../../assets/inster.png';
import linkedinIcon from '../../assets/linkedin.png';

const Footer = () => {   
  return (     
    <footer className="footer">       
      <div className="container">         
        <div className="footer-content">
          <div className="logo-section">             
            <div className="logo">               
              <span><a href="https://communeo.live/" className="text">Communeo</a></span>               
              <span className="dot">.</span>             
            </div>             
            <p className="tagline">               
              Bringing communities together through shared connections.             
            </p>             
            <div className="social-links">               
                            
              <a href="https://youtube.com/@communeo_cc?si=kPP08g3F9IR6Ptwc" target="_blank" rel="noopener noreferrer" className="social-link">                 
                <img src={youtubeIcon} alt="YouTube" className="social-icon" />               
              </a> 
              <a href="https://www.facebook.com/profile.php?id=61573791051187" target="_blank" rel="noopener noreferrer" className="social-link">                 
                <img src={facebookIcon} alt="YouTube" className="social-icon" />               
              </a>              
              <a href="https://www.instagram.com/communeo.app?igsh=MWRjZzR5bmgxMTh2MA==" target="_blank" rel="noopener noreferrer" className="social-link">                 
                <img src={instagramIcon} alt="Instagram" className="social-icon" />               
              </a>               
              <a href="https://www.linkedin.com/company/communeo/" target="_blank" rel="noopener noreferrer" className="social-link">                 
                <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />               
              </a>             
            </div>           
          </div>            
          <div className="footer-nav">             
            <div className="footer-column">               
              <h3>Company</h3>               
              <ul>                 
                <li><Link to="/about" className="link">About Us</Link></li>                 
                <li><Link to="/login" className="link">Sign in</Link></li>                 
                <li><Link to="/register" className="link">Join</Link></li>               
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
                  <span>communeo_group@communeo.live</span>                 
                </li>                 
                <li>                   
                  <i className="icon-phone"></i>                   
                  <span>(+94)77 968 8262</span>                 
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
            <Link to="#" className="link">Privacy Policy</Link>             
            <Link to="#" className="link">Terms of Service</Link>           
          </div>         
        </div>       
      </div>     
    </footer>   
  ); 
};  

export default Footer;