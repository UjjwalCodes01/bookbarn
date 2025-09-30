import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Toast = ({ toast, onRemove }) => {
  const { colors } = useTheme();

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const iconColors = {
    success: '#10B981',
    error: '#EF4444',
    info: colors.accent
  };

  const Icon = icons[toast.type];

  const toastVariants = {
    initial: {
      opacity: 0,
      x: 300,
      scale: 0.8
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: 300,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex items-center gap-3 p-4 rounded-lg shadow-lg border min-w-80 max-w-md"
      style={{ 
        backgroundColor: colors.surface,
        borderColor: colors.border
      }}
    >
      <Icon 
        size={20} 
        style={{ color: iconColors[toast.type] }}
      />
      
      <div className="flex-1">
        <div className="font-medium" style={{ color: colors.text }}>
          {toast.title}
        </div>
        {toast.message && (
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {toast.message}
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-full transition-colors"
        style={{ color: colors.textSecondary }}
      >
        <X size={16} />
      </motion.button>
    </motion.div>
  );
};

const ToastContainer = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onRemove={onRemoveToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;