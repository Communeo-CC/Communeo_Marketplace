import React, { useState } from "react";
import "./InfluencerFeatured.scss";
import { useNavigate } from "react-router-dom";
import GIF3 from "../../assets/influencer.gif";

function InfluencerFeatured() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate(`/influencers?search=${input}`);
  };

  return (
    <div className="influencerFeatured">
      <div className="container">
        <div className="left">
          <h1>
            Discover the best <span>influencers</span> for your brand
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder='Try "tech influencer"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Tech</button>
            <button>Fashion</button>
            <button>Travel</button>
            <button>Fitness</button>
          </div>
        </div>
        <div className="right">
          <img src={GIF3} alt="Gif" />
        </div>
      </div>
    </div>
  );
}

export default InfluencerFeatured;