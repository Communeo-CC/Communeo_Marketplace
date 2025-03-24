import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function GigCard({ item }) {
  const { isLoading, error, data } = useQuery({
    queryKey: [`${item.userId}`],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt={item.title} />
        <div className="info">
          {isLoading ? (
            "loading"
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={data.img || "/img/noavatar.jpg"} alt={data.username} />
              <span>{data.username}</span>
              {data.isVerified && (
                <img className="verified-badge" src="/img/verified.png" alt="Verified" title="Verified Professional" />
              )}
            </div>
          )}
          <div className="desc">
            <h2>{truncateText(item.title, 60)}</h2>
            <p>{truncateText(item.desc, 100)}</p>
          </div>
          <div className="star">
            <img src="./img/star.png" alt="rating" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber * 10) / 10}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="price">
            <span>STARTING AT</span>
            <h2>${item.price}</h2>
          </div>
          <div className="metrics">
            <img src="./img/heart.png" alt="saves" />
            <span>{item.saves || 0}</span>
            <img src="./img/order.png" alt="orders" />
            <span>{item.orders || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default GigCard;
