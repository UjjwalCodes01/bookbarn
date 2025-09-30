import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const AddBookModal = ({ isOpen, onClose, onAdd }) => {
  const { theme, colors } = useContext(ThemeContext);
  
  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    genre: '',
    coverImage: '',
    status: 'want-to-read',
    description: ''
  });

  const handleInputChange = (field, value) => {
    setBookData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bookData.title && bookData.author) {
      onAdd({
        id: Date.now(),
        ...bookData,
        dateAdded: new Date().toISOString()
      });
      setBookData({
        title: '',
        author: '',
        genre: '',
        coverImage: '',
        status: 'want-to-read',
        description: ''
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-4 z-[100]"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-xl shadow-2xl border"
            style={{ 
              backgroundColor: colors.surface,
              borderColor: colors.border
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                Add New Book
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: colors.surfaceLight,
                  color: colors.textSecondary 
                }}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Book Title *
                  </label>
                  <input
                    type="text"
                    value={bookData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter book title"
                    required
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Author *
                  </label>
                  <input
                    type="text"
                    value={bookData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Enter author name"
                    required
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Genre
                  </label>
                  <input
                    type="text"
                    value={bookData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="e.g., Fiction, Non-fiction, Mystery"
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={bookData.coverImage}
                    onChange={(e) => handleInputChange('coverImage', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Status
                  </label>
                  <select
                    value={bookData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="currently-reading">Currently Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Description
                  </label>
                  <textarea
                    value={bookData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border transition-all duration-200 resize-none text-sm"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.text,
                      outline: 'none'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.accent;
                      e.target.style.boxShadow = `0 0 0 2px ${colors.accent}30`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border;
                      e.target.style.boxShadow = 'none';
                    }}
                    placeholder="Brief description of the book..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 p-6 pt-4 border-t" style={{ borderColor: colors.border }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  style={{ 
                    backgroundColor: colors.surface,
                    color: colors.textSecondary,
                    border: `1px solid ${colors.border}`
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!bookData.title || !bookData.author}
                  className="px-4 py-2 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    backgroundColor: bookData.title && bookData.author ? colors.accent : colors.surface,
                    color: bookData.title && bookData.author ? '#fff' : colors.textSecondary,
                    border: `1px solid ${bookData.title && bookData.author ? colors.accent : colors.border}`
                  }}
                >
                  Add Book
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddBookModal;