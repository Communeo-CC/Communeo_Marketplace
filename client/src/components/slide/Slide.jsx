import React from "react";
import "./Slide.scss";
import Slider from "infinite-react-carousel";
import CatCard from "../catCard/CatCard";

const categories = [
  {
    id: 1,
    title: "Social Media Marketing",
    desc: "Build your brand presence",
    img: "/img/slides/Social Media Marketing.png",
    cat: "social-media"
  },
  {
    id: 2,
    title: "SEO & Analytics",
    desc: "Boost your online visibility",
    img: "/img/slides/SEO & Analytics.png",
    cat: "seo-analytics"
  },
  {
    id: 3,
    title: "Content Marketing",
    desc: "Engage your audience",
    img: "/img/slides/Content Marketing.png",
    cat: "content"
  },
  {
    id: 4,
    title: "Email Marketing",
    desc: "Convert leads to customers",
    img: "/img/slides/Email Marketing.png",
    cat: "email"
  },
  {
    id: 5,
    title: "PPC & Paid Advertising",
    desc: "Drive targeted traffic",
    img: "/img/slides/PPC & Paid Advertising.png",
    cat: "ppc"
  },
  {
    id: 6,
    title: "Influencer Marketing",
    desc: "Amplify your reach",
    img: "/img/slides/Influencer Marketing.png",
    cat: "influencer"
  },
  {
    id: 7,
    title: "Marketing Strategy",
    desc: "Plan your success",
    img: "/img/slides/Marketing Strategy.png",
    cat: "strategy"
  },
  {
    id: 8,
    title: "Brand Marketing",
    desc: "Define your identity",
    img: "/img/slides/Brand Marketing.png",
    cat: "branding"
  }
];

const Slide = ({ slidesToShow, arrowsScroll }) => {
  return (
    <div className="slide">
      <div className="container">
        <Slider slidesToShow={slidesToShow} arrowsScroll={arrowsScroll}>
          {categories.map((card) => (
            <CatCard key={card.id} card={card} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;
