import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export { ThemeContext };

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('bookbarn-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('bookbarn-theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      background: '#0D0D0D',
      surface: '#1A1A1A',
      surfaceLight: '#2A2A2A',
      text: '#EAEAEA',
      textSecondary: '#B0B0B0',
      accent: '#00ADB5',
      accentPurple: '#9B5DE5',
      accentBlue: '#3A86FF',
      border: '#333333',
      shadow: 'rgba(0, 0, 0, 0.5)',
      hover: '#333333'
    } : {
      background: '#FFFFFF',
      surface: '#F8F9FA',
      surfaceLight: '#FFFFFF',
      text: '#2D3436',
      textSecondary: '#636E72',
      accent: '#00ADB5',
      accentPurple: '#9B5DE5',
      accentBlue: '#3A86FF',
      border: '#E2E8F0',
      shadow: 'rgba(0, 0, 0, 0.1)',
      hover: '#F1F5F9'
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};