import React, { useState } from "react";
import "./Slide.scss";
import Slider from "infinite-react-carousel";

const Slide = ({ children, slidesToShow, arrowsScroll, categories = ["all"] }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter children based on category if they have a 'category' prop
  const filteredChildren = activeCategory === "all" 
    ? children
    : React.Children.toArray(children).filter(child => 
        child.props.card && child.props.card.category === activeCategory
      );

  return (
    <div className="slide">
      <div className="container">
        {categories.length > 1 && (
          <div className="category-filter">
            <div className="filter-buttons">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`filter-btn ${activeCategory === category ? "active" : ""}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
          {filteredChildren}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;