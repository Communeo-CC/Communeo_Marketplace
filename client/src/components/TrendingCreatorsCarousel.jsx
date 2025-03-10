import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./TrendingCreatorsCarousel.css"; // Import CSS file

const TrendingCreatorsCarousel = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const creators = [
    { name: "John Doe", followers: "1.2M", image: "https://via.placeholder.com/300" },
    { name: "Jane Smith", followers: "850K", image: "https://via.placeholder.com/300" },
    { name: "Mike Johnson", followers: "600K", image: "https://via.placeholder.com/300" },
    { name: "Emily Davis", followers: "500K", image: "https://via.placeholder.com/300" },
    { name: "Chris Brown", followers: "400K", image: "https://via.placeholder.com/300" }
  ];

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">🔥 Trending Creators</h2>

      <div className="carousel-wrapper">
        {/* Left Button */}
        <button onClick={scrollLeft} className="carousel-button left">
          <ChevronLeft size={24} />
        </button>

        {/* Carousel */}
        <div ref={carouselRef} className="carousel">
          {creators.map((creator, index) => (
            <div key={index} className="carousel-item">
              <img src={creator.image} alt={creator.name} className="carousel-image" />
              <div className="carousel-overlay">
                <h3 className="carousel-name">{creator.name}</h3>
                <p className="carousel-followers">{creator.followers} Followers</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button onClick={scrollRight} className="carousel-button right">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default TrendingCreatorsCarousel;
