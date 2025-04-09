import React, { createContext, useState, useEffect } from 'react';

// Create the theme context
export const ThemeContext = createContext();

// Create the theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if user has a theme preference in localStorage
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark'; // Default to dark theme
  };

  // State to track the current theme
  const [theme, setTheme] = useState(getInitialTheme);

  // Update the theme in localStorage and apply CSS variables when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Provide the theme context to children components
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
