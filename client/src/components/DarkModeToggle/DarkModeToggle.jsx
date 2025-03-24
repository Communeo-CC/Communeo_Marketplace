import React, { useState } from 'react';
import './DarkModeToggle.scss';

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, you would also toggle a class on the body or update a context
  };

  return (
    <div className="dark-mode-toggle">
      <button 
        className={`toggle-button ${isDarkMode ? 'dark' : 'light'}`}
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="toggle-icon">
          {isDarkMode ? '☀️' : '🌙'}
        </span>
        <span className="toggle-text">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};

export default DarkModeToggle;