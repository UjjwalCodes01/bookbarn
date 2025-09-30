import React from 'react';
import { motion } from 'framer-motion';
import { Book, Trash2, Eye, Play, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const BookCard = ({ book, onDelete, onRead }) => {
  const { colors } = useTheme();

  // Status configuration
  const statusConfig = {
    'want-to-read': {
      label: 'Want to Read',
      color: '#9B5DE5',
      icon: Eye,
      buttonText: 'Start Reading',
      buttonColor: colors.accent
    },
    'currently-reading': {
      label: 'Currently Reading',
      color: '#F59E0B',
      icon: Play,
      buttonText: 'Mark as Read',
      buttonColor: '#F59E0B'
    },
    'read': {
      label: 'Read',
      color: '#10B981',
      icon: CheckCircle,
      buttonText: 'Read Again',
      buttonColor: '#10B981'
    }
  };

  const currentStatus = statusConfig[book.status] || statusConfig['want-to-read'];
  const StatusIcon = currentStatus.icon;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.4
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      scale: 0.9,
      transition: {
        duration: 0.3
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: `0 20px 40px ${colors.shadow}`,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover="hover"
      className="relative group"
    >
      <motion.div
        variants={hoverVariants}
        className="w-80 h-[420px] rounded-xl overflow-hidden shadow-lg"
        style={{ 
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`
        }}
      >
        {/* Book Cover */}
        <div 
          className="h-60 w-full relative overflow-hidden"
          style={{ backgroundColor: colors.surfaceLight }}
        >
          {book.coverImage ? (
            <img 
              src={book.coverImage} 
              alt={book.title || 'Book cover'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: colors.surfaceLight }}
            >
              <Book 
                size={64} 
                style={{ color: colors.textSecondary }}
              />
            </div>
          )}
          
          {/* Status Badge */}
          <div 
            className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
            style={{ backgroundColor: currentStatus.color }}
          >
            <StatusIcon size={12} />
            <span>{currentStatus.label}</span>
          </div>
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Book Details */}
        <div className="p-6 h-40 flex flex-col justify-between">
          <div>
            <h3 
              className="text-xl font-bold mb-2 line-clamp-2"
              style={{ color: colors.text }}
            >
              {book.title || 'Book Title'}
            </h3>
            <p 
              className="text-sm line-clamp-2"
              style={{ color: colors.textSecondary }}
            >
              {book.author || 'Unknown Author'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                            onClick={() => onRead(book._id || book.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 flex-1"
              style={{ backgroundColor: currentStatus.buttonColor }}
            >
              <StatusIcon size={18} />
              <span>{currentStatus.buttonText}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(book._id || book.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300"
              style={{ backgroundColor: '#EF4444' }}
            >
              <Trash2 size={18} />
              <span>Delete</span>
            </motion.button>
          </div>
        </div>

        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, ${colors.accent}20, ${colors.accentPurple}20, ${colors.accentBlue}20)`,
            filter: 'blur(1px)'
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default BookCard;