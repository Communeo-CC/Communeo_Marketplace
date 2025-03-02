import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation(); // This hook gives you access to the current route

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page whenever the route changes
  }, [location]);

  return null;
};

export default ScrollToTop;
