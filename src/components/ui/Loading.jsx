/**
 * Loading Components
 * Comprehensive loading states and skeletons for better UX
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCircleNotch, 
  faHourglass,
  faCheckCircle,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '../../lib/styleUtils';

/**
 * Primary Loading Spinner Component
 */
export const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  className = '',
  'aria-label': ariaLabel = 'Loading...',
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3 text-xs',
    sm: 'w-4 h-4 text-sm', 
    md: 'w-5 h-5 text-base',
    lg: 'w-6 h-6 text-lg',
    xl: 'w-8 h-8 text-xl',
    '2xl': 'w-10 h-10 text-2xl',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };

  return (
    <FontAwesomeIcon
      icon={faSpinner}
      spin
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      aria-label={ariaLabel}
      role="status"
    />
  );
};

/**
 * Full Page Loading Screen
 */
export const LoadingScreen = ({ 
  message = 'Loading...', 
  submessage = null,
  variant = 'default', // 'default', 'minimal', 'logo'
  className = '' 
}) => {
  if (variant === 'minimal') {
    return (
      <div 
        className={cn(
          "fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50",
          className
        )}
        role="status"
        aria-label={message}
      >
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
          {submessage && (
            <p className="mt-2 text-sm text-gray-600">{submessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "fixed inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center z-50",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-label={message}
    >
      <div className="text-center max-w-md mx-auto px-6">
        {/* Animated Logo/Icon */}
        <motion.div 
          className="w-24 h-24 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "linear" }
          }}
        >
          <span className="text-2xl font-bold text-white">SM</span>
        </motion.div>
        
        {/* Loading Message */}
        <motion.h2 
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.h2>
        
        {submessage && (
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {submessage}
          </motion.p>
        )}
        
        {/* Progress Animation */}
        <motion.div 
          className="w-full bg-gray-200 rounded-full h-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="bg-primary-gradient h-2 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        {/* Spinner */}
        <LoadingSpinner size="lg" className="opacity-75" />
      </div>
    </motion.div>
  );
};

/**
 * Inline Loading Component
 */
export const InlineLoading = ({ 
  message = 'Loading...', 
  size = 'sm',
  className = '' 
}) => {
  return (
    <div 
      className={cn("flex items-center gap-3", className)}
      role="status"
      aria-label={message}
    >
      <LoadingSpinner size={size} />
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

/**
 * Button Loading State
 */
export const LoadingButton = ({ 
  children, 
  loading = false, 
  disabled = false,
  loadingText = 'Loading...',
  className = '',
  ...props 
}) => {
  return (
    <button
      className={cn(
        "btn-primary relative",
        loading && "cursor-wait",
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      <span className={cn("flex items-center gap-2", loading && "opacity-0")}>
        {children}
      </span>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
          <span className="ml-2 text-sm">{loadingText}</span>
        </div>
      )}
    </button>
  );
};

/**
 * Skeleton Loading Components
 */
export const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  variant = 'rectangular', // 'rectangular', 'circular', 'text'
  animation = 'pulse' // 'pulse', 'wave', 'none'
}) => {
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded-sm',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        "bg-gray-200",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{ width, height }}
      role="status"
      aria-label="Loading content"
    />
  );
};

/**
 * Skeleton Text Block
 */
export const SkeletonText = ({ 
  lines = 3, 
  className = '',
  lastLineWidth = '60%' 
}) => {
  return (
    <div className={cn("space-y-2", className)} role="status" aria-label="Loading text content">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          variant="text"
        />
      ))}
    </div>
  );
};

/**
 * Card Skeleton
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div 
      className={cn("card-modern p-6", className)}
      role="status"
      aria-label="Loading card content"
    >
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton variant="circular" width="3rem" height="3rem" />
        <div className="flex-1">
          <Skeleton height="1rem" width="40%" className="mb-2" />
          <Skeleton height="0.875rem" width="60%" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex gap-2 mt-4">
        <Skeleton height="2.5rem" width="5rem" />
        <Skeleton height="2.5rem" width="5rem" />
      </div>
    </div>
  );
};

/**
 * Table Skeleton
 */
export const SkeletonTable = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  return (
    <div 
      className={cn("space-y-3", className)}
      role="status"
      aria-label="Loading table content"
    >
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton 
            key={`header-${index}`}
            height="1rem" 
            width={index === 0 ? "25%" : "auto"}
            className="flex-1"
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`}
              height="1rem"
              width={colIndex === 0 ? "25%" : "auto"}
              className="flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  label = null,
  variant = 'default', // 'default', 'success', 'warning', 'error'
  size = 'md', // 'sm', 'md', 'lg'
  showPercentage = true,
  className = '' 
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variantClasses = {
    default: 'bg-primary-gradient',
    success: 'bg-success-gradient',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-red-600',
  };

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <motion.div
          className={cn("h-full rounded-full", variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/**
 * Status Indicator with Loading States
 */
export const StatusIndicator = ({ 
  status = 'loading', // 'loading', 'success', 'error', 'warning'
  message = '',
  size = 'md',
  className = '' 
}) => {
  const configs = {
    loading: {
      icon: faSpinner,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      spin: true,
    },
    success: {
      icon: faCheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      spin: false,
    },
    error: {
      icon: faExclamationTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      spin: false,
    },
    warning: {
      icon: faExclamationTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      spin: false,
    },
  };

  const config = configs[status] || configs.loading;
  
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  return (
    <motion.div
      className={cn(
        "flex items-center gap-3 rounded-lg border",
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
    >
      <FontAwesomeIcon
        icon={config.icon}
        className={cn(config.color, "flex-shrink-0")}
        spin={config.spin}
        aria-hidden="true"
      />
      {message && (
        <span className={cn("font-medium", config.color)}>{message}</span>
      )}
    </motion.div>
  );
};

export default {
  LoadingSpinner,
  LoadingScreen,
  InlineLoading,
  LoadingButton,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  ProgressBar,
  StatusIndicator,
};