import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, bookTitle }) => {
  const { colors } = useTheme();

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl shadow-2xl"
              style={{ backgroundColor: colors.surface }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.border }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                    <AlertTriangle size={18} color="white" />
                  </div>
                  <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    Delete Book
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: colors.surfaceLight }}
                >
                  <X size={20} style={{ color: colors.textSecondary }} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-4" style={{ color: colors.text }}>
                  Are you sure you want to delete <strong>"{bookTitle}"</strong>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg font-medium border transition-all duration-200"
                    style={{ 
                      backgroundColor: colors.surfaceLight,
                      borderColor: colors.border,
                      color: colors.textSecondary
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                    style={{ backgroundColor: '#EF4444' }}
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteModal;