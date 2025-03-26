import React from "react";
import "./Freelancer.scss";
import Featured from "../../components/featured/Featured";
import TrustedBy from "../../components/trustedBy/TrustedBy";
import { Link } from "react-router-dom";

function Freelancer() {
  return (
    <div className="freelancer">
      <Featured />
      
      <div className="explore">
        <div className="container">
          <h1>Explore the marketplace</h1>
          <div className="items">
            <Link to="/gigs?cat=social-media" className="item">
              <img
                src="./img/1.svg"
                alt="Social Media Marketing"
              />
              <div className="line"></div>
              <span>Social Media Marketing</span>
            </Link>
            <Link to="/gigs?cat=seo-analytics" className="item">
              <img
                src="./img/6.svg"
                alt="SEO & Analytics"
              />
              <div className="line"></div>
              <span>SEO & Analytics</span>
            </Link>
            <Link to="/gigs?cat=content" className="item">
              <img
                src="./img/4.svg"
                alt="Content Marketing"
              />
              <div className="line"></div>
              <span>Content Marketing</span>
            </Link>
            <Link to="/gigs?cat=email" className="item">
              <img
                src="./img/3.svg"
                alt="Email Marketing"
              />
              <div className="line"></div>
              <span>Email Marketing</span>
            </Link>
            <Link to="/gigs?cat=ppc" className="item">
              <img
                src="./img/5.svg"
                alt="PPC & Paid Advertising"
              />
              <div className="line"></div>
              <span>PPC & Paid Advertising</span>
            </Link>
            <Link to="/gigs?cat=influencer" className="item">
              <img
                src="./img/2.svg"
                alt="Influencer Marketing"
              />
              <div className="line"></div>
              <span>Influencer Marketing</span>
            </Link>
            <Link to="/gigs?cat=strategy" className="item">
              <img
                src="./img/7.svg"
                alt="Marketing Strategy"
              />
              <div className="line"></div>
              <span>Marketing Strategy</span>
            </Link>
            <Link to="/gigs?cat=branding" className="item">
              <img
                src="./img/8.svg"
                alt="Brand Marketing"
              />
              <div className="line"></div>
              <span>Brand Marketing</span>
            </Link>
          </div>
        </div>
      </div>   

      <div className="features dark">
        <div className="container">
          <div className="item">
            <h1>
              Communeo <i>business</i>
            </h1>
            <h2>
              A business solution designed for teams
            </h2>
            <p>
              Upgrade to a curated experience packed with tools and benefits,
              dedicated to businesses
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Connect to freelancers with proven business experience
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Get matched with the perfect talent by a customer success manager
            </div>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Manage teamwork and boost productivity with one powerful workspace
            </div>
            <a href="https://communeo.live" target="_blank" rel="noopener noreferrer">
              <button>Explore Communeo</button>
            </a>
          </div>
          <div className="item">
            <img
              src="https://fiverr-res.cloudinary.com/q_auto,f_auto,w_870,dpr_2.0/v1/attachments/generic_asset/asset/d9c17ceebda44764b591a8074a898e63-1599597624768/business-desktop-870-x2.png"
              alt=""
            />
          </div>
        </div>
      </div>      

      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertips</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              The best for every budget
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Protected payments, every time
            </div>
            <p>
              Always know what you'll pay upfront. Your payment isn't released
              until you approve the work.
            </p>
            <div className="title">
              <img src="./img/check.png" alt="" />
              24/7 support
            </div>
            <p>
              Find high-quality services at every price point. No hourly rates,
              just project-based pricing.
            </p>
          </div>
          <div className="item">
            <video src="./img/video.mp4" controls />
          </div>
        </div>
      </div>

    </div>
  );
}

export default Freelancer;
