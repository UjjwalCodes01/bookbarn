import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, Menu, X, Plus, BookOpen, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onAddBook, onSearch, searchQuery, onFilterChange, currentFilter, onRefresh }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const navItems = [
    { key: 'all', label: 'All' },
    { key: 'read', label: 'Read' },
    { key: 'want-to-read', label: 'Want to Read' },
    { key: 'currently-reading', label: 'Currently Reading' }
  ];

  const handleNavClick = (filterKey) => {
    onFilterChange(filterKey);
    setIsMenuOpen(false); // Close mobile menu
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.6
      }
    }
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-40 w-full"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="backdrop-blur-md border-b w-full" style={{ borderColor: colors.border }}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <motion.div
              variants={logoVariants}
              whileHover="hover"
              className="flex items-center gap-3 cursor-pointer flex-shrink-0"
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.accent }}
              >
                <BookOpen size={24} color="white" />
              </div>
              <h1 
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: colors.text }}
              >
                BookBarn
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavClick(item.key)}
                  className="text-base font-medium transition-all duration-300 relative group px-3 py-2 rounded-lg"
                  style={{ 
                    color: currentFilter === item.key ? colors.accent : colors.textSecondary,
                    backgroundColor: currentFilter === item.key ? colors.hover : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (currentFilter !== item.key) {
                      e.target.style.color = colors.accent;
                      e.target.style.backgroundColor = colors.hover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentFilter !== item.key) {
                      e.target.style.color = colors.textSecondary;
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {item.label}
                  {currentFilter === item.key && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              {/* Search Bar */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                animate={{ scale: isFocused ? 1.02 : 1 }}
              >
                <div 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-300 min-w-0"
                  style={{ 
                    backgroundColor: colors.surfaceLight,
                    borderColor: isFocused ? colors.accent : colors.border,
                    boxShadow: isFocused ? `0 0 0 2px ${colors.accent}30` : 'none'
                  }}
                >
                  <Search 
                    size={18} 
                    style={{ color: colors.textSecondary }}
                    className="flex-shrink-0"
                  />
                  <input
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => onSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="w-48 bg-transparent outline-none text-sm placeholder:text-sm"
                    style={{ color: colors.text }}
                  />
                </div>
              </motion.div>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: colors.surfaceLight,
                  border: `1px solid ${colors.border}`
                }}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={18} style={{ color: colors.accent }} />
                ) : (
                  <Moon size={18} style={{ color: colors.accent }} />
                )}
              </motion.button>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onRefresh}
                className="p-2 rounded-lg transition-all duration-300"
                style={{ 
                  backgroundColor: colors.surfaceLight,
                  border: `1px solid ${colors.border}`
                }}
                title="Refresh Books"
              >
                <RefreshCw size={18} style={{ color: colors.accent }} />
              </motion.button>

              {/* Add Book Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAddBook}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 whitespace-nowrap"
                style={{ backgroundColor: colors.accent }}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Book</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg flex-shrink-0"
              style={{ 
                backgroundColor: colors.surfaceLight,
                border: `1px solid ${colors.border}`
              }}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} style={{ color: colors.text }} />
              ) : (
                <Menu size={20} style={{ color: colors.text }} />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isMenuOpen ? 'auto' : 0,
              opacity: isMenuOpen ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="pt-4 pb-4 space-y-4 border-t" style={{ borderColor: colors.border }}>
              {/* Mobile Search */}
              <div 
                className="flex items-center gap-3 px-3 py-2 rounded-lg border"
                style={{ 
                  backgroundColor: colors.surfaceLight,
                  borderColor: colors.border
                }}
              >
                <Search 
                  size={18} 
                  style={{ color: colors.textSecondary }}
                />
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: colors.text }}
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <motion.button
                    key={item.key}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavClick(item.key)}
                    className="block w-full text-left px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                    style={{ 
                      color: currentFilter === item.key ? colors.accent : colors.text,
                      backgroundColor: currentFilter === item.key ? colors.hover : 'transparent'
                    }}
                  >
                    {item.label}
                    {currentFilter === item.key && (
                      <motion.div
                        className="h-0.5 bg-current rounded-full mt-1"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 pt-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg flex-1 text-sm font-medium"
                  style={{ 
                    backgroundColor: colors.surfaceLight,
                    color: colors.text,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>{isDark ? 'Light' : 'Dark'}</span>
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onAddBook}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white flex-1 text-sm font-medium"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Plus size={16} />
                  <span>Add Book</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;