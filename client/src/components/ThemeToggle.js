import React, { useContext } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme} 
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <FiSun className="theme-icon" />
      ) : (
        <FiMoon className="theme-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
