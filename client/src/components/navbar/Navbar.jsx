import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Navbar.scss";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
   };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await newRequest.post("/auth/logout");
      localStorage.setItem("currentUser", null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (open) setOpen(false);
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Communeo</span>
          </Link>
          <span className="dot">.</span>
        </div>
        
        {/* Desktop Links */}
        <div className="links">
          
          <Link className="link" to="/about">
          <span>About Us </span>
          </Link>
          <Link className="link" to="/freelancer">
          <span>Freelancers </span>
          </Link>
          <Link className="link" to="/influencer">
          <span>Influencers </span>
          </Link>
          
          {!currentUser?.isSeller && <Link className="link" to="/register">Become a Seller</Link>}

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">Sign in</Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div 
          className={active ? "menuButton active" : "menuButton"} 
          onClick={toggleMobileMenu}
        >
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

        {/* Mobile Menu */}
        <div className={mobileMenuOpen ? "mobileMenu active" : "mobileMenu"}>
          <span>About Us</span>
          <a href="https://communeo.live" target="_blank" rel="noopener noreferrer">Communeo Group</a>
          {!currentUser?.isSeller && <span>Become a Seller</span>}
          
          {currentUser ? (
            <div className="userMobile">
              <div className="userInfo">
                <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                <span>{currentUser?.username}</span>
              </div>
              <div className="optionsMobile">
                {currentUser.isSeller && (
                  <>
                    <Link className="link" to="/mygigs" onClick={() => setMobileMenuOpen(false)}>
                      Gigs
                    </Link>
                    <Link className="link" to="/add" onClick={() => setMobileMenuOpen(false)}>
                      Add New Gig
                    </Link>
                  </>
                )}
                <Link className="link" to="/orders" onClick={() => setMobileMenuOpen(false)}>
                  Orders
                </Link>
                <Link className="link" to="/messages" onClick={() => setMobileMenuOpen(false)}>
                  Messages
                </Link>
                <Link 
                  className="link" 
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="link" onClick={() => setMobileMenuOpen(false)}>
                Sign in
              </Link>
              <Link className="link" to="/register" onClick={() => setMobileMenuOpen(false)}>
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;