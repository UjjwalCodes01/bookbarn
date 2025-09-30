import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { colors } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotsVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizeClasses[size]} border-2 border-transparent rounded-full`}
        style={{
          borderTopColor: colors.accent,
          borderRightColor: colors.accentPurple,
        }}
      />
      
      {text && (
        <div className="flex items-center gap-1">
          <span style={{ color: colors.textSecondary }}>{text}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={dotsVariants}
                animate="animate"
                className="w-1 h-1 rounded-full"
                style={{ 
                  backgroundColor: colors.accent,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;