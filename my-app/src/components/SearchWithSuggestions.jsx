import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const SearchWithSuggestions = ({ 
  searchQuery, 
  suggestions, 
  showSuggestions, 
  onSearch, 
  onSelectSuggestion, 
  onClearSearch,
  setShowSuggestions 
}) => {
  const { colors } = useTheme();
  const searchRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  const suggestionVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -10,
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <motion.div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300"
        style={{ 
          backgroundColor: colors.surfaceLight,
          borderColor: showSuggestions ? colors.accent : colors.border,
          boxShadow: showSuggestions ? `0 0 0 3px ${colors.accent}30` : 'none'
        }}
        whileHover={{ scale: 1.02 }}
      >
        <Search 
          size={20} 
          style={{ color: colors.textSecondary }}
        />
        <input
          type="text"
          placeholder="Search books, authors, genres..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          className="flex-1 bg-transparent outline-none text-lg"
          style={{ color: colors.text }}
        />
        {searchQuery && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClearSearch}
            className="p-1 rounded-full transition-colors duration-200"
            style={{ color: colors.textSecondary }}
          >
            <X size={16} />
          </motion.button>
        )}
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            variants={suggestionVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg z-50 overflow-hidden"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border,
              boxShadow: `0 10px 40px ${colors.shadow}`
            }}
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => onSelectSuggestion(suggestion)}
                  className="w-full px-4 py-3 text-left transition-all duration-200 flex items-center gap-3"
                  style={{ color: colors.text }}
                  whileHover={{ 
                    backgroundColor: colors.hover,
                    x: 4
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search 
                    size={16} 
                    style={{ color: colors.textSecondary }}
                  />
                  <span className="flex-1">{suggestion}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchWithSuggestions;