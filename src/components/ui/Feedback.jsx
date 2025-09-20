/**
 * Feedback System Components
 * Provides toast notifications, alerts, and user feedback mechanisms
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationTriangle, 
  faInfoCircle, 
  faTimes,
  faExclamationCircle,
  faBell,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '../../lib/styleUtils';
import { AriaUtils } from '../../lib/accessibility';

// Feedback Context
const FeedbackContext = createContext();

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

/**
 * Feedback Provider Component
 */
export const FeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [nextId, setNextId] = useState(1);

  const addToast = (toast) => {
    const id = nextId;
    setNextId(prev => prev + 1);
    
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
      timestamp: Date.now(),
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    // Announce to screen readers
    const messages = {
      success: `Success: ${newToast.message}`,
      error: `Error: ${newToast.message}`,
      warning: `Warning: ${newToast.message}`,
      info: newToast.message,
    };
    
    AriaUtils.announce(messages[newToast.type] || newToast.message, 
      newToast.type === 'error' ? 'assertive' : 'polite');

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options = {}) => addToast({ type: 'success', message, ...options });
  const error = (message, options = {}) => addToast({ type: 'error', message, duration: 8000, ...options });
  const warning = (message, options = {}) => addToast({ type: 'warning', message, ...options });
  const info = (message, options = {}) => addToast({ type: 'info', message, ...options });
  const loading = (message, options = {}) => addToast({ type: 'loading', message, duration: 0, ...options });

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    loading,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ToastContainer />
    </FeedbackContext.Provider>
  );
};

/**
 * Toast Container Component
 */
const ToastContainer = () => {
  const { toasts } = useFeedback();

  return (
    <div 
      className="fixed top-4 right-4 z-toast space-y-3 max-w-sm w-full"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Individual Toast Item
 */
const ToastItem = ({ toast }) => {
  const { removeToast } = useFeedback();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (toast.duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const elapsed = Date.now() - toast.timestamp;
          const remaining = Math.max(0, ((toast.duration - elapsed) / toast.duration) * 100);
          return remaining;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.timestamp]);

  const configs = {
    success: {
      icon: faCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
      progressColor: 'bg-green-500',
    },
    error: {
      icon: faExclamationCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      progressColor: 'bg-red-500',
    },
    warning: {
      icon: faExclamationTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
      progressColor: 'bg-yellow-500',
    },
    info: {
      icon: faInfoCircle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
      progressColor: 'bg-blue-500',
    },
    loading: {
      icon: faSpinner,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-500',
      textColor: 'text-gray-800',
      progressColor: 'bg-gray-500',
      spin: true,
    },
  };

  const config = configs[toast.type] || configs.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-lg border shadow-lg backdrop-blur-sm",
        config.bgColor,
        config.borderColor
      )}
      role="alert"
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <FontAwesomeIcon
            icon={config.icon}
            className={cn("mt-0.5 flex-shrink-0", config.iconColor)}
            spin={config.spin}
            aria-hidden="true"
          />
          
          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className={cn("font-medium mb-1", config.textColor)}>
                {toast.title}
              </h4>
            )}
            <p className={cn("text-sm", config.textColor)}>
              {toast.message}
            </p>
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className={cn(
                    "text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded",
                    config.textColor
                  )}
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => removeToast(toast.id)}
            className={cn(
              "flex-shrink-0 p-1 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
              config.textColor
            )}
            aria-label="Dismiss notification"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <motion.div
            className={cn("h-full", config.progressColor)}
            initial={{ width: "100%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
        </div>
      )}
    </motion.div>
  );
};

/**
 * Alert Component
 */
export const Alert = ({ 
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300); // Wait for animation
    }
  };

  const configs = {
    success: {
      icon: faCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
    },
    error: {
      icon: faExclamationCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
    },
    warning: {
      icon: faExclamationTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: faInfoCircle,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
    },
  };

  const config = configs[type] || configs.info;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-lg border p-4",
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon
          icon={config.icon}
          className={cn("mt-0.5 flex-shrink-0", config.iconColor)}
          aria-hidden="true"
        />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn("font-medium mb-2", config.textColor)}>
              {title}
            </h3>
          )}
          <div className={cn("text-sm", config.textColor)}>
            {children}
          </div>
        </div>
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              "flex-shrink-0 p-1 rounded-md hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
              config.textColor
            )}
            aria-label="Dismiss alert"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Banner Component
 */
export const Banner = ({ 
  type = 'info',
  children,
  action,
  dismissible = true,
  onDismiss,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      setTimeout(onDismiss, 300);
    }
  };

  const configs = {
    success: {
      bgColor: 'bg-green-600',
      textColor: 'text-white',
    },
    error: {
      bgColor: 'bg-red-600',
      textColor: 'text-white',
    },
    warning: {
      bgColor: 'bg-yellow-600',
      textColor: 'text-white',
    },
    info: {
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
    },
  };

  const config = configs[type] || configs.info;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "w-full py-3 px-4",
        config.bgColor,
        className
      )}
      role="banner"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className={cn("flex-1 text-sm font-medium", config.textColor)}>
          {children}
        </div>
        
        <div className="flex items-center gap-4">
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 rounded px-2 py-1",
                config.textColor
              )}
            >
              {action.label}
            </button>
          )}
          
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                "p-1 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors",
                config.textColor
              )}
              aria-label="Dismiss banner"
            >
              <FontAwesomeIcon icon={faTimes} className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Notification Badge Component
 */
export const NotificationBadge = ({ 
  count = 0, 
  max = 99,
  variant = 'error',
  size = 'md',
  className = '' 
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count.toString();

  const variantClasses = {
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
    success: 'bg-green-500 text-white',
  };

  const sizeClasses = {
    sm: 'h-4 min-w-4 text-xs px-1',
    md: 'h-5 min-w-5 text-xs px-1.5',
    lg: 'h-6 min-w-6 text-sm px-2',
  };

  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={`${count} notification${count !== 1 ? 's' : ''}`}
    >
      {displayCount}
    </motion.span>
  );
};

export default {
  FeedbackProvider,
  useFeedback,
  Alert,
  Banner,
  NotificationBadge,
};