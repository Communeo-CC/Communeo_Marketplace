import React, { useState } from "react";
import "./InfluencerFeatured.scss";
import { useNavigate } from "react-router-dom";
import GIF3 from "../../assets/phone.gif";

function InfluencerFeatured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/influencers?search=${input}`);
  };

  return (
    <div className="influencerFeatured">
      <div className="background-circles">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>
      
      <div className="container">
        <div className="left">
          <div className="title-container">
            <h1>
              Discover the best <span>influencers</span> for your brand
            </h1>
          </div>
          
          <div className="search-container">
            <div className="search">
              <div className="searchInput">
                <img src="./img/search.png" alt="" />
                <input
                  type="text"
                  placeholder='Try "tech influencer"'
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <button onClick={handleSubmit}>
                <span>Search</span>
              </button>
            </div>
          </div>
          
          <div className="popular">
            <span>Popular:</span>
            <div className="popular-buttons">
              <button>Tech</button>
              <button>Fashion</button>
              <button>Travel</button>
              <button>Fitness</button>
            </div>
          </div>
        </div>
        
        <div className="right">
          <div className="image-container">
            <img src={GIF3} alt="Gif" />
          </div>
        </div>
      </div>
    </div>
  );
}
