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

        </div>
        <div className="right">
          <img src={GIF3} alt="Gif" />
        </div>
      </div>
    </div>
  );
}

export default InfluencerFeatured;